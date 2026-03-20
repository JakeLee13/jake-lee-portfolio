# Layers, Not Loops: Building a Production Churn Analysis System with LLMs

*February 2025*

Every churned enterprise account has a story, and it's almost never the one your CRM tells you. The "loss reason" field says "Budget" -- but the emails show a frustrated VP who stopped getting value six months ago, the call transcripts reveal a competitor evaluation that nobody flagged, and the usage metrics show Card Loads cratering to z=-2.3 weeks before anyone noticed. At Domo, I built a system that triangulates all of this automatically: emails, call transcripts, and z-scored usage metrics fed through a 4-stage LLM pipeline that produces polished HTML reports for each churned account and across entire cohorts. No autonomous agents. No tool-use loops. Just layered prompts with strict input/output contracts, run in parallel.

The result: forensic-quality churn reports that CS leaders pull up in meetings, share with executives, and use to spot patterns across quarters. Built in a Jupyter notebook. Shipped to production via a Domo app. The whole thing runs in under 6 minutes for 34 accounts.

---

## CRM loss reasons are fiction

If you've worked in B2B SaaS, you know the ritual. A customer churns. The AE picks "Budget" from a dropdown. The CRM records it. Leadership reviews a pie chart of loss reasons next quarter and concludes that pricing is the problem.

It's not that they're lying. It's that a single-select dropdown cannot capture what actually happened. Churn is almost always multi-causal, and it unfolds over months. The real story is buried across dozens of email threads, scattered call recordings, and usage data that nobody has time to correlate manually -- especially when you're analyzing 30+ accounts per quarter.

Here's what the gap actually looks like:

| Account | CRM Loss Reason | What the Pipeline Found |
|---------|----------------|------------------------|
| Acct A | Budget | Budget + Competitive Pressure (Power BI eval started 6 months prior, Unique User Logins at z=-2.3) |
| Acct B | Product | Value Realization -- implementation never completed, Dataflow Runs at z=-3.0 for 4 consecutive months |
| Acct C | Internal Change | Strategy Shift + Support Problems (3 escalation emails unanswered over 2 months) |

The CRM captured one dimension. The pipeline captured three, with evidence, timelines, and metric correlation. That's the difference between a dropdown and forensics.

---

## The pipeline at a glance

The system is a 4-stage pipeline. Each stage has clearly defined inputs and outputs, and most stages run in parallel across accounts using our custom SDK.

```
┌─────────────────────────────────────────────────────────────────┐
│                   STAGE 1: SIGNAL EXTRACTION                    │
│                                                                 │
│  Emails              Calls              Usage Metrics           │
│  ┌──────────┐       ┌──────────┐       ┌──────────────────┐    │
│  │ Clean    │       │ Extract  │       │ Z-Score          │    │
│  │  (LLM)   │       │ Signals  │       │  (Pure Python)   │    │
│  │          │       │  (LLM)   │       │                  │    │
│  │ Extract  │       │          │       │  694(z=-1.8)     │    │
│  │ Signals  │       │          │       │                  │    │
│  │  (LLM)   │       │          │       │                  │    │
│  └────┬─────┘       └────┬─────┘       └────────┬─────────┘    │
└───────┼──────────────────┼──────────────────────┼──────────────┘
        │                  │                      │
        ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              STAGE 2: ACCOUNT TRIANGULATION                     │
│                                                                 │
│  2a: Triangulation → reasoning_scratchpad + analysis JSON       │
│  2b: Formatter → polished HTML report (no new analysis)         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              STAGE 3: COHORT AGGREGATION                        │
│                                                                 │
│  3a: Map → chunk ~8 accounts, summarize each (parallel)         │
│  3b: Reduce → consolidate sub-cohort JSONs into master          │
│  3c: Format → master JSON to cohort HTML report                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              STAGE 4: OUTPUT                                    │
│                                                                 │
│  Chunk HTML → Upload to Domo datasets → Display in Domo App     │
└─────────────────────────────────────────────────────────────────┘
```

| Stage | Input | Output | Pattern |
|-------|-------|--------|---------|
| 1a-b | Raw emails, context card | Cleaned emails → loss signals (confidence >= 0.75) | `llm.parallel()`, 60 workers |
| 1c | Call transcripts, context card | Loss signals (confidence >= 0.75) | `llm.parallel()`, 20 workers |
| 1d | Raw usage metrics | Z-scored metric JSON | Pure Python (no LLM) |
| 2a | All Stage 1 outputs | Triangulated analysis JSON with reasoning scratchpad | `llm.parallel()`, 10 workers |
| 2b | Stage 2a JSON | Polished HTML report | `llm.parallel()` (formatting only) |
| 3a | Chunks of ~8 account JSONs | Sub-cohort summary JSON | `llm.parallel()`, 4 workers |
| 3b | All sub-cohort JSONs | Master cohort JSON | Single `llm.prompt()` |
| 3c | Master JSON | Cohort HTML report | Single `llm.prompt()` (formatting only) |

A quick note on what makes this work at the infrastructure level: boring data prep. Before any LLM touches anything, we've already queried the right datasets, filtered to the right fiscal quarter, built context cards for each account, and structured every input so the prompts can focus purely on analysis. We built a custom SDK (`domo_sdk`) that wraps LLM calls and Domo data I/O into a clean interface:

```python
from domo_sdk import *

query = f"""SELECT * FROM table WHERE `Cancelled Date FQ` = 'FY26 Q4' """
qualitative = data.query('d036b19d-...', query)
quantitative = data.query('6b353b4e-...', query)
context = data.query('5c06c1f8-...', query)
```

Three lines to load all the data for a quarter's churned accounts. The SDK also gives us `llm.prompt()` for single LLM calls and `llm.parallel()` for fanning out across accounts with configurable worker counts and built-in retry logic. This is the unglamorous foundation that makes rapid iteration possible -- when a prompt change takes 5 minutes to test across 34 accounts instead of 45, you iterate 9x more.

---

## Making metrics LLM-readable with z-scores

This is the single highest-leverage thing we did, and it's embarrassingly simple.

Raw metrics are meaningless to an LLM. "694 Unique User Logins" -- is that good or bad? The model has no idea. It doesn't know that this account normally has 850 logins, or that 694 represents a significant decline. You could add baseline context in prose, but that burns tokens and adds ambiguity.

Instead, we z-score every metric against the account's own historical baseline and embed the z-score directly in the value string:

```python
def prepare_metrics_for_account(account_name):
    account_metrics = quantitative[quantitative['Account Name'] == account_name].copy()
    account_metrics = account_metrics[account_metrics['Days to Cancel'].notna()].sort_values('Month')

    base_metrics = [
        'Card Loads', 'Stored Rows of Data', 'Queried Rows of Data',
        'Cards Created', 'Dataflows Created', 'Datasets Created',
        'Domo Desktop Visit', 'Dataflow Run', 'Unique User Logins'
    ]

    metrics_data = {}
    for metric in base_metrics:
        month_values = {}
        has_data = False
        for _, row in account_metrics.iterrows():
            month_str = str(row['Month'])[:7]
            if pd.notna(row.get(metric)):
                val = row[metric]
                zscore = row.get(f"{metric}_zscore")
                # The key line: compact format that's LLM-readable
                month_values[month_str] = f"{val}(z={round(zscore, 2)})" if pd.notna(zscore) else str(val)
                has_data = True
        if has_data:
            metrics_data[metric] = month_values

    return {'Account Name': account_name, 'metrics_json': json.dumps(metrics_data, indent=2)}
```

The format `694(z=-1.8)` packs two pieces of information into a compact string: the raw value and its deviation from baseline. A z-score of -1.8 immediately tells the model "this is nearly two standard deviations below normal." No additional context needed.

### What the model actually sees

Here's what the metric JSON looks like when it reaches the triangulation prompt:

```json
{
  "Card Loads": {
    "2024-11": "12470(z=0.3)",
    "2024-12": "11890(z=0.1)",
    "2025-01": "8940(z=-0.9)",
    "2025-02": "6940(z=-1.8)",
    "2025-03": "4120(z=-2.6)"
  },
  "Unique User Logins": {
    "2024-11": "87(z=0.2)",
    "2024-12": "82(z=0.0)",
    "2025-01": "64(z=-1.1)",
    "2025-02": "41(z=-2.3)",
    "2025-03": "22(z=-3.1)"
  }
}
```

And the prompt tells the model exactly how to interpret them:

> **Z-scores**: Values with z < -1.5 indicate significant declines, z > 1.5 indicate significant increases
>
> **Triangulation**: Match email/call dates with corresponding days_to_cancel periods for signal-metric correlation

The beauty of z-scores here is that they put every metric on the same scale. Card Loads and Unique User Logins have wildly different magnitudes, but z=-1.8 means the same thing for both: a significant decline from this account's baseline. The model can now compare across metrics without any normalization gymnastics. It can say "Card Loads and Unique User Logins both crossed z=-1.5 in January" and that statement is immediately meaningful.

---

## Signal extraction and the custom SDK

### Cleaning the mess

Enterprise email data is filthy. Forwarding chains nested six deep, HTML signatures, legal disclaimers, auto-generated calendar confirmations mixed in with actual human communication. Before any analysis happens, every email goes through a cleaning prompt:

```python
EMAIL_CLEANING_PROMPT = """
# TASK
Extract only the relevant email content, removing all formatting artifacts,
signatures, headers, and forwarding chains.

# INPUT
{email_content}

# QUALITY STANDARDS
- Preserve all numbers, dates, and specific details mentioned
- Keep conversational context that explains what's being discussed
- Remove only formatting junk, not substantive content
- If multiple messages in chain, separate with "---" between messages
- Keep direct quotes from customers intact

Return only the JSON object.
"""

# Process all emails for an account in parallel -- 60 workers
cleaned_emails = llm.parallel(
    items=email_records,
    prompt_func=process_single_email_clean,
    max_workers=60,
)
```

This is the "boring" data prep that makes everything downstream possible. Each cleaning call is cheap and fast, so we fan out with 60 workers. The cleaned output is structured JSON with sender, date, and body -- ready for the signal extraction prompt.

### Extracting signals with confidence thresholds

Each email thread and call transcript gets analyzed for "loss signals" -- specific statements that indicate churn risk. The system extracts signals into 9 categories:

1. Competitive Pressure
2. Budget & Cost Pressures
3. Consumption Model Concerns
4. Product Functionality Gaps
5. Value Realization Issues
6. Support & Service Problems
7. Implementation Challenges
8. Internal Changes & Strategy Shifts
9. Relationship & Communication Issues

The critical design decision: a confidence threshold of >= 0.75, with explicit calibration guidance baked into the prompt:

```
## CONFIDENCE SCORING & VALIDATION
Apply these confidence thresholds rigorously:

**0.85-1.0 (Certainly Drives Loss)**
- Formal cancellation notice or explicit non-renewal statement
- Executive-level escalation with documented decision criteria
- Documented competitive evaluations with specific alternatives named

**0.75-0.84 (Likely Contributes to Loss)**
- Strong budget pressure language from decision-maker
- Explicit feature gap complaints tied to business impact

**Below 0.75 (Exclude)**
- Routine operational questions or minor issues
- Concerns that appear to be addressed or resolved in thread
- Vague dissatisfaction without actionable specifics
```

Each extracted signal must include a verbatim quote, the sender's name and role, the date, the conversational context that triggered it, and why it implies churn risk. The output schema forces this structure:

```json
{
  "type": "Competitive Pressure",
  "verbatim_quote_or_statement": "We've been evaluating Power BI as part of our Microsoft consolidation strategy. The bundled pricing is hard to argue against internally.",
  "email_date": "2024-11-08",
  "sender_name": "David Park, VP of Analytics",
  "context_and_trigger": "In response to renewal discussion, VP mentioned...",
  "loss_implication": "Active competitive evaluation driven by platform consolidation, suggesting Domo may not survive the vendor rationalization.",
  "confidence_score": 0.92,
  "competitor_name": "Power BI"
}
```

This is where the separation of concerns pays off. The Stage 1 prompts are *only* responsible for extracting raw signals. They don't synthesize, they don't form narratives, they don't connect dots across data sources. That's Stage 2's job. Each prompt does one thing well.

---

## Account-level triangulation

### Chain-of-thought as a first-class output field

Stage 2 is the most sophisticated prompt in the pipeline. It takes all Stage 1 outputs -- email signals, call signals, z-scored metrics -- and synthesizes them into a unified analysis. The key design decision: the `reasoning_scratchpad` is a required field in the output JSON, populated *before* the final analysis fields.

```
# CORE TASK
Synthesize the provided email analysis, call analysis, and quantitative metric data
into an evidence-backed JSON report. You will first create a "reasoning_scratchpad"
to build your chain of thought, then use that reasoning to generate the four core
components: 1) Loss Summary, 2) Key Inflection Points, 3) Loss Narrative,
and 4) Missed Signals.
```

The prompt explicitly instructs the model to reason first:

```
## Step 1: Pre-Analysis Reasoning & Triangulation (Chain of Thought)
- Scan All Evidence: Review all inputs to get a holistic view.
- Identify Key Signals: List the 3-5 most critical qualitative signals.
- Identify Key Inflections: List the 2-4 most significant metric inflection
  points (e.g., "Unique User Logins z=-2.5 at 120 days_to_cancel").
- Form Triangulations: Explicitly connect signals and metrics.
  Example: "The customer's email about 'implementation challenges' on Jan 15
  (110 days_to_cancel) lines up perfectly with 'Cards Created' falling to
  0 (z=-3.1) in that same period."
- Hypothesize Root Cause: Formulate a 1-2 sentence hypothesis.
- Populate `reasoning_scratchpad`: Place this analysis in the output JSON.
```

This isn't just prompting technique for its own sake. Making the scratchpad a required JSON field means the model *must* reason before concluding. And because it's in the output, we can inspect the reasoning when a report looks off. It's chain-of-thought that's auditable, not hidden in the model's internal processing.

The full invocation is clean:

```python
report_json_str = llm.prompt(
    STAGE2_TRIANGULATION_PROMPT,
    account_name=account_name,
    cancellation_date=cancellation_date,
    email_analysis=email_analysis,
    call_analysis=call_analysis,
    metrics_json=metrics_json,
    context_card=context_card
)
```

Six variables. One prompt. One structured JSON output containing everything we need.

### The separation that saved us: analysis vs. formatting

Early versions of this system tried to do analysis and HTML generation in one prompt. The results were terrible. The model would hallucinate data points while trying to make the HTML look good, or produce ugly HTML while trying to reason carefully about the evidence. Two competing objectives in one prompt meant both suffered.

The fix was splitting Stage 2 into two sub-stages:

- **Stage 2a (Triangulation)**: Analyze everything, output structured JSON. No HTML, no formatting concerns.
- **Stage 2b (Formatter)**: Take the JSON, populate an HTML template. No new analysis allowed.

The formatter prompt's instruction is explicit:

```python
STAGE2B_FORMATTER_PROMPT = """
# ROLE
You are an expert HTML report generator. Your *only* task is to take the provided
account metadata and the JSON analysis object and perfectly populate a final HTML
report template. You must not add any new analysis, opinions, or text that isn't
derived from the inputs.
"""
```

Separation of analysis and presentation is not optional for production LLM systems. When one prompt does both, you get a system that's impossible to debug -- did the model get the analysis wrong, or did it just render it badly? With separation, you can inspect the Stage 2a JSON independently of the HTML. If the analysis is good but the HTML is bad, you fix the formatter. If the HTML is fine but the analysis is wrong, you fix the triangulation prompt. Each stage is independently testable.[^1]

[^1]: This principle extends beyond LLM systems. It's the same reason MVC exists, the same reason you separate business logic from presentation in any well-architected system. The fact that it needs to be restated for LLM applications tells you how young this field is.

---

## Cohort aggregation via map/reduce

### Why you can't just dump 34 accounts into one prompt

With 34 churned accounts in a quarter, each producing a multi-thousand-token analysis JSON, the total data blows past any reasonable context window. Even if it fit, the quality would degrade -- models struggle to maintain analytical coherence across that much input.

The solution is the oldest trick in distributed systems: map/reduce.

```python
CHUNK_SIZE = 8
chunks = split_dataframe_into_chunks(stage2_df, CHUNK_SIZE)
print(f"Splitting {len(stage2_df)} accounts into {len(chunks)} chunks of ~{CHUNK_SIZE}...")

# Map: generate sub-cohort summaries in parallel
stage3a_results_list = llm.parallel(
    items=chunks,
    prompt_func=process_3a_chunk,
    max_workers=4,
)

# Reduce: consolidate all sub-cohort JSONs into master report
final_cohort_json = llm.prompt(
    STAGE3B_CONSOLIDATION_PROMPT,
    agg_cohort_context=context_str,
    aggregate_sub_cohort_json=aggregate_sub_cohort_json_str
)
```

Stage 3a (map) processes ~8 accounts at a time, aggregating loss theme distributions, identifying patterns, and selecting representative account highlights. Stage 3b (reduce) merges all sub-cohort reports into a single master JSON -- re-summing theme counts, recalculating percentages, and synthesizing a unified narrative. Stage 3c formats the master JSON into a cohort-level HTML report, following the same analysis-free formatting pattern as Stage 2b.

Nothing novel here. That's the point. The best LLM engineering uses boring, proven patterns applied to new constraints. Map/reduce was solving data aggregation problems before anyone was talking about large language models.

---

## What the output looks like

Here's what a CS leader sees when they pull up a report. This is a fabricated example for "Meridian Financial Group" -- a fictional mid-market financial services company -- to illustrate the output format without exposing real customer data.

---

> ### Meridian Financial Group -- Account Loss Report
>
> | Lost ARR | Tenure | AE | CSM | Cancellation Date |
> |----------|--------|-----|-----|-------------------|
> | $185,000 | 3.2 years | Michael Torres | Sarah Chen | April 15, 2025 |
>
> **Loss Summary**
>
> Primary Themes: Competitive Pressure, Budget & Cost Pressures
>
> Meridian churned due to a Microsoft platform consolidation strategy where Power BI's bundled pricing undercut Domo's standalone value proposition, accelerated by a CFO-mandated 40% reduction in analytics spend. The competitive evaluation began in November 2024 -- five months before cancellation -- but was not flagged by the CS team until February 2025 when usage metrics had already declined past the point of recovery.
>
> **Timeline**
>
> - **Nov 8, 2024** (158 days before cancel): VP of Analytics emails CSM mentioning "evaluating Power BI as part of our Microsoft consolidation strategy"
> - **Dec 2, 2024** (134 days): Unique User Logins drop to z=-1.1. Card Loads begin declining.
> - **Dec 12, 2024** (124 days): CFO states on QBR call: "We need to reduce our analytics spend by 40%"
> - **Jan 15, 2025** (90 days): Card Loads hit z=-1.8. Dataflow Runs at z=-2.1. Power BI pilot expands to second business unit.
> - **Feb 20, 2025** (54 days): CSM notes competitive risk for first time. Unique User Logins at z=-3.1.
> - **Mar 28, 2025** (18 days): Formal non-renewal notice received.
>
> **Loss Narrative**
>
> The churn trajectory became visible in November 2024, when VP of Analytics David Park noted in a direct email to the CSM: "We've been evaluating Power BI as part of our Microsoft consolidation strategy. The bundled pricing is hard to argue against internally." At this point, Unique User Logins had already begun a subtle decline from 87 to 82 (z=0.0), but the real signal was qualitative -- an active competitive evaluation driven by platform economics, not product dissatisfaction.
>
> By December, the financial dimension crystallized. CFO Lisa Morgan stated on a quarterly business review call that the company needed to "reduce analytics spend by 40%," citing pressure from the board to consolidate vendor relationships. Card Loads dropped from 11,890 to 8,940 (z=-0.9) -- not yet alarming in isolation, but the combination of a CFO budget mandate and an active competitive evaluation should have triggered an immediate retention response.
>
> The window closed in January. Card Loads hit z=-1.8 and Dataflow Runs fell to z=-2.1 as the Power BI pilot expanded to a second business unit. By the time the CSM noted competitive risk in February, Unique User Logins were at z=-3.1 -- the account was functionally already gone.
>
> **Missed Signals**
>
> 1. **Nov 8, 2024**: CS missed the competitive evaluation signal when VP Park mentioned Power BI in an email. At this point, a competitive save offer or executive sponsor engagement could have changed the outcome. Unique User Logins were still at baseline.
>
> 2. **Dec 12, 2024**: CS missed the budget pressure signal when CFO Morgan stated "reduce analytics spend by 40%." This should have triggered immediate escalation to Sales leadership for a pricing conversation, before the competitive evaluation gained organizational momentum.

---

This is what makes the output format effective. It's not a summary -- it's a story with dates, names, quotes, and metric evidence. A CS leader can pull this up in a meeting and walk through the timeline. An executive can read the loss summary in 30 seconds and understand the pattern. The missed signals section turns retrospective analysis into prospective training: "here's where we could have intervened, with what action, and what evidence we had at the time."

These reports live in two places: as sharable HTML documents and inside a Domo app where the CS team can browse, filter, and search across all accounts. The cohort-level report aggregates the patterns -- "35% of Q4 losses involved competitive pressure, with Power BI and Tableau appearing in 60% of those cases" -- giving leadership the systemic view that no single-account analysis can provide.

---

## Layers, not loops

### What "agentic" actually means

The AI discourse has collapsed "uses an LLM" into "agentic," and the lack of precision is causing real architectural confusion. An agent, at its core, is an LLM with access to tools, operating in a loop where the model decides what to do next based on intermediate results. The key property is *runtime branching* -- the execution path is not predetermined. ReAct loops, tool-calling cycles, autonomous planners that decide which APIs to call: these are agents.

### Why this system doesn't need it

This pipeline is deterministic in its execution order. Stage 1 always runs before Stage 2. Stage 2 always runs before Stage 3. There is no branching, no tool selection, no "let the model decide what to do next." Each stage has a fixed input schema and a fixed output schema. The prompts are elaborate and carefully engineered, but they are *functions* -- not decision-makers.

| Property | Agent | Pipeline (this system) |
|----------|-------|----------------------|
| Execution order | Runtime-determined | Fixed at design time |
| Tool selection | Model chooses | No tools, just prompts |
| Looping | Yes, model decides when to stop | No loops, linear stages |
| Failure mode | Unbounded cost/time, hard to debug | Bounded, each stage independently testable |
| Debugging | Trace through decision tree | Inspect input/output at each stage |
| When to use | Ambiguous tasks, open-ended exploration | Well-defined transformations with known data |

Calling this system "agentic" would be like calling a Unix pipeline of `grep | sort | uniq` agentic because each step processes data. The distinction matters because it determines your failure modes, your debugging strategy, and your cost model. An agent that goes off-track might burn through $50 of API calls before you notice. A pipeline stage that fails gives you a clear error at a known point, with the previous stage's output intact for debugging.

### When you actually need agents

I want to be honest about the limitations. If this pipeline encountered an account with unusually sparse data, it cannot decide to go search for additional sources. If a report quality is poor for a specific account, it cannot self-correct or re-analyze with different emphasis. If the system needed to dynamically query different databases based on what it found in the emails, that would require agentic behavior -- runtime tool selection based on intermediate results.

For this use case, those tradeoffs are acceptable. The data sources are known in advance. The analysis structure is well-defined. The output format is fixed. When your problem is well-structured, the pipeline wins on every dimension that matters in production: cost, latency, debuggability, and trust.

An agent decides what to do next. A pipeline knows what to do next. Know which one your problem needs.

---

## What I'd do differently

This system works and ships value, but it's not perfect. A few things I'd change:

**HTML chunking is a hack.** Domo's dataset columns have character limits, so we split the HTML reports into 7 columns and reassemble them on the app side. This works, but it's fragile. A proper document storage layer would be cleaner.

**Email cleaning could be cheaper.** Using an LLM call for every email is expensive when a regex + heuristic pre-pass could handle 80% of the formatting cleanup. I haven't tested this, but I suspect the cost savings would be significant given that email cleaning is the highest-volume stage (60 workers, hundreds of emails per quarter).

**Confidence thresholds are hand-tuned.** The 0.75 cutoff and the calibration tiers feel right based on iteration, but I don't have a controlled experiment comparing human reviewer agreement at different thresholds. If I were building this again, I'd invest in a small labeled dataset to calibrate empirically.

**The real prize is real-time.** This system is retrospective -- it analyzes accounts that have already churned. The same pipeline architecture could power a real-time early warning system: run Stage 1 continuously on active accounts, flag when signal density or metric z-scores cross thresholds, and surface at-risk accounts before the cancellation notice arrives. That's the next iteration.

---

*The code for this system runs on Domo's internal infrastructure using our custom SDK. The prompts, schemas, and architecture patterns described here are from the production system, with customer data replaced by fictional examples.*

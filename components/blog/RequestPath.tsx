type Zone = "client" | "edge" | "frontend" | "gpu" | "stream";

const zoneMeta: Record<Zone, { label: string; dot: string; ring: string; text: string }> = {
  client: {
    label: "Your machine",
    dot: "bg-amber-500",
    ring: "border-amber-500/30",
    text: "text-amber-500",
  },
  edge: {
    label: "Edge / network",
    dot: "bg-sky-500",
    ring: "border-sky-500/30",
    text: "text-sky-500",
  },
  frontend: {
    label: "Serving frontend",
    dot: "bg-emerald-500",
    ring: "border-emerald-500/30",
    text: "text-emerald-500",
  },
  gpu: {
    label: "GPU (Trainium / TPU / H100)",
    dot: "bg-violet-500",
    ring: "border-violet-500/30",
    text: "text-violet-500",
  },
  stream: {
    label: "Stream back",
    dot: "bg-rose-500",
    ring: "border-rose-500/30",
    text: "text-rose-500",
  },
};

interface Station {
  num: string;
  zone: Zone;
  name: string;
  oneLine: string;
  panel: React.ReactNode;
  stat?: string;
  /** Physical location: hardware, metal, networking link the op actually executes on. */
  where: { hw: string; net: string; site: string };
}

const codeBlockClass =
  "font-mono text-[10.5px] leading-[1.55] text-gray-700 dark:text-gray-300 bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-md p-3 whitespace-pre overflow-x-auto";

const labelClass =
  "font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5";

const Mono = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <span className="font-mono text-gray-700 dark:text-gray-300">{children}</span>
);

const Note = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
    {children}
  </p>
);

const stations: Station[] = [
  // ─────────────────── 01: KEYSTROKE ───────────────────
  {
    num: "01",
    zone: "client",
    name: "Keystroke → API request",
    oneLine:
      "Claude Code packages the message, system prompt, tool schemas, and conversation history into a JSON body.",
    stat: "~50K tokens of context",
    where: {
      hw: "Your laptop CPU (M-series / x86) · Node.js process",
      net: "localhost — no network yet",
      site: "your desk",
    },
    panel: (
      <div className="space-y-3">
        <div>
          <p className={labelClass}>POST https://api.anthropic.com/v1/messages</p>
          <pre className={codeBlockClass}>{`{
  "model": "claude-opus-4-7",
  "max_tokens": 4096,
  "stream": true,
  "system": "You are Claude Code, Anthropic's official CLI...",
  "tools": [
    { "name": "Read",  "input_schema": { ... } },
    { "name": "Edit",  "input_schema": { ... } },
    { "name": "Bash",  "input_schema": { ... } },
    ...
  ],
  "messages": [
    { "role": "user",
      "content": "Add dark mode functionality to my blog." }
  ]
}`}</pre>
        </div>
        <Note>
          <Mono>x-api-key</Mono>, <Mono>anthropic-version: 2023-06-01</Mono>, and{" "}
          <Mono>content-type: application/json</Mono> headers attached. The
          payload looks tiny — but the system prompt and tool schemas alone are
          ~5–8K tokens before the user types anything.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 02: HTTPS ───────────────────
  {
    num: "02",
    zone: "edge",
    name: "DNS → TLS 1.3 → HTTP/2",
    oneLine:
      "api.anthropic.com resolves to an Anthropic-owned IP block, terminating at Cloudflare's edge.",
    stat: "TLS 1.3 · ALPN h2",
    where: {
      hw: "Cloudflare edge server (commodity x86 + Linux) — TLS terminator",
      net: "your ISP → public internet → BGP-anycast to nearest Cloudflare PoP (e.g. DEN, SJC, IAD)",
      site: "Cloudflare PoP — ~10–30 ms RTT from you",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`$ dig +short api.anthropic.com
160.79.104.10            ← Anthropic-owned /24 (ARIN: AP-2440)

$ curl -vI https://api.anthropic.com
* TLSv1.3 (OUT), Client hello
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
* ALPN: server accepted h2
* Server certificate: CN=api.anthropic.com, issuer=WE1 (Google Trust Services)

< HTTP/2 200
< server: cloudflare
< cf-ray: 9f32cff6...-DEN`}</pre>
        <Note>
          Anthropic announces its own /24 through Cloudflare&apos;s edge (BYOIP /
          Magic Transit pattern). TLS 1.3 + HTTP/2 over TCP. No HTTP/3
          (Alt-Svc not advertised). The <Mono>cf-ray</Mono> tells you the PoP —{" "}
          <Mono>-DEN</Mono> is Denver.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 03: ROUTING ───────────────────
  {
    num: "03",
    zone: "frontend",
    name: "Auth · rate limit · prefix-affinity routing",
    oneLine:
      "Past the edge, the request is authenticated, rate-checked, then steered to the replica that already holds this prefix's KV cache.",
    stat: "~5 min cache TTL",
    where: {
      hw: "Anthropic frontend pods — x86 CPUs running Envoy / Go / Python services. No accelerators yet.",
      net: "Cloudflare → Anthropic origin over Magic Transit, then internal VPC mesh (AWS us-east-1 / us-west-2 or GCP us-central1)",
      site: "AWS or GCP region — same region as the GPU/Trainium fleet, sub-1ms to it",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`prefix_hash = sha256(system + tools[] + messages[0..N-1])
replica     = consistent_hash(prefix_hash) → "decode-pool/shard-43"

cache_lookup(prefix_hash) → HIT
  ↳ skip prefill for the 49,950 cached tokens
  ↳ only the new 50-token tail needs prefill`}</pre>
        <Note>
          Prompt caching is the load-bearing economics for agents. Anthropic&apos;s
          docs commit to per-replica prefix locality (otherwise the cache
          couldn&apos;t hit), so the LB has to be prefix-aware. Cache reads bill at{" "}
          ~10% of input price; cache writes at ~125%. Claude Code&apos;s 84–92%
          hit rate is the difference between agents being routine and
          uneconomic.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 04: TOKENIZATION ───────────────────
  {
    num: "04",
    zone: "frontend",
    name: "Tokenization (BPE)",
    oneLine:
      "The new tail of the conversation is split into subword tokens. Byte-level BPE — same family as cl100k_base / o200k_base.",
    stat: '"add dark mode functionality" = 4 tokens',
    where: {
      hw: "x86 CPU on the same serving pod — pure-CPU op, often Rust/C++ behind Python",
      net: "in-process — function call, no RPC",
      site: "Anthropic serving frontend, same datacenter rack as the accelerators",
    },
    panel: (
      <div className="space-y-3">
        <div>
          <p className={labelClass}>Input string</p>
          <pre className={codeBlockClass}>{`"add dark mode functionality"`}</pre>
        </div>
        <div>
          <p className={labelClass}>BPE merges (cl100k_base trace)</p>
          <pre className={codeBlockClass}>{`bytes:    a d d   d a r k   m o d e   f u n c t i o n a l i t y
  ↓ merge "ad" + "d"  →  "add"
  ↓ merge " d" + "a" + "r" + "k"  →  " dark"
  ↓ merge " m" + "o" + "d" + "e"  →  " mode"
  ↓ merge " function" + "ality"   →  " functionality"   (1 token!)
                                                         (no leading space → 2)`}</pre>
        </div>
        <div>
          <p className={labelClass}>Final tokens</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { tok: "add", id: 723 },
              { tok: " dark", id: 6453 },
              { tok: " mode", id: 3941 },
              { tok: " functionality", id: 15293 },
            ].map((t) => (
              <div
                key={t.id}
                className="bg-emerald-500/5 border border-emerald-500/20 rounded-md px-2 py-2 text-center"
              >
                <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                  &quot;{t.tok}&quot;
                </p>
                <p className="font-mono text-[10px] text-gray-500 mt-1">
                  id: {t.id}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Note>
          IDs above are <Mono>cl100k_base</Mono> (GPT-4) — Claude&apos;s
          tokenizer is private, but its English token counts come within ~5–10%
          of cl100k. The leading space is part of each mid-sentence token.{" "}
          <Mono>&quot; functionality&quot;</Mono> is one token; the space-less
          form splits to <Mono>function + ality</Mono>.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 05: EMBEDDINGS ───────────────────
  {
    num: "05",
    zone: "gpu",
    name: "Embedding lookup",
    oneLine:
      "Each token ID becomes a row of an 8,192-dim BF16 vector. This is the token's entire presence on the GPU from now on.",
    stat: "128,256 × 8,192 · BF16 · 2.10 GB",
    where: {
      hw: "Accelerator: H100/H200 (Hopper, TSMC N4) · or Trainium2 · or TPU v5p. embed_tokens lives in HBM3/HBM3E next to the die.",
      net: "PCIe Gen5 host→device the first time the model is loaded; after that, on-chip.",
      site: "Inside one GPU's HBM stacks — the gather op never leaves the package.",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`hidden_states = embed_tokens[ [723, 6453, 3941, 15293] ]
                ↑
                row gather from a 128,256 × 8,192 matrix

shape: [batch=1, seq_len=4, hidden=8192]   dtype: bfloat16`}</pre>
        <div>
          <p className={labelClass}>Row 6453 — what &quot; dark&quot; literally is</p>
          <pre className={codeBlockClass}>{`embed_tokens[6453] =
[ 0.0237, -0.1418,  0.0091, -0.0203,  0.0044,  0.0612, -0.0089, -0.0341,
  0.0118, -0.0276,  0.0501, -0.0157,  0.0024,  0.0193, -0.0408,  0.0612,
  ...
  // 8,192 BF16 floats total — most in [-0.05, 0.05], σ ≈ 0.013
  ...
  0.0177, -0.0264,  0.0512 ]`}</pre>
        </div>
        <Note>
          On the GPU it&apos;s a gather: one CUDA block per token, one thread per
          dim. Under tensor parallelism (Megatron <Mono>VocabParallelEmbedding</Mono>
          ), the vocab dim is sharded across ranks; an all-reduce stitches the
          result. Most weights live in the band <Mono>[-0.05, 0.05]</Mono>; a
          few outlier dimensions run 5–10× larger (the ones quantization
          schemes have to special-case).
        </Note>
      </div>
    ),
  },

  // ─────────────────── 06: ROPE ───────────────────
  {
    num: "06",
    zone: "gpu",
    name: "Rotary position encoding (RoPE)",
    oneLine:
      "Position information isn't added — it's rotated in. Each Q/K vector pair gets twisted by an angle proportional to position.",
    stat: "θᵢ = pos · 500,000^(−2i/128)",
    where: {
      hw: "Same GPU's tensor cores — fused into the attention kernel, runs on Q/K tensors already in registers/SRAM",
      net: "none — on-chip",
      site: "Inside the streaming multiprocessors (SMs) of one GPU",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`for each attention head (head_dim = 128):
  pair dims (0,1), (2,3), ..., (126,127)
  rotate pair i by angle  θᵢ(pos) = pos · base^(−2i/128)
  Llama-3 base = 500,000  (raised from 10K to extend context to 128K)`}</pre>
        <div>
          <p className={labelClass}>Rotation angles (radians) by position × dim-pair</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[10.5px] font-mono">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-1.5 pr-3">position</th>
                  <th className="text-left px-3">pair (0,1)</th>
                  <th className="text-left px-3">pair (32,33)</th>
                  <th className="text-left px-3">pair (64,65)</th>
                  <th className="text-left px-3">pair (126,127)</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="py-1 pr-3 text-gray-500">0 (&quot;add&quot;)</td>
                  <td className="px-3">0.000</td>
                  <td className="px-3">0.000</td>
                  <td className="px-3">0.000</td>
                  <td className="px-3">0.000</td>
                </tr>
                <tr>
                  <td className="py-1 pr-3 text-gray-500">1 (&quot; dark&quot;)</td>
                  <td className="px-3">1.000</td>
                  <td className="px-3">0.0145</td>
                  <td className="px-3">2.1e-4</td>
                  <td className="px-3">~2e-6</td>
                </tr>
                <tr>
                  <td className="py-1 pr-3 text-gray-500">3 (&quot; functionality&quot;)</td>
                  <td className="px-3">3.000</td>
                  <td className="px-3">0.0436</td>
                  <td className="px-3">6.3e-4</td>
                  <td className="px-3">~6e-6</td>
                </tr>
                <tr>
                  <td className="py-1 pr-3 text-gray-500">128,000</td>
                  <td className="px-3">128k mod 2π</td>
                  <td className="px-3">1859</td>
                  <td className="px-3">26.9</td>
                  <td className="px-3">0.247</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Note>
          Low-frequency pairs spin fast (encode local position). High-frequency
          pairs barely move (encode coarse, long-range position). This is why
          context-window extension is software, not architecture: rescale the
          base, fine-tune briefly, and a model trained at 8K reaches 128K.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 07: TRANSFORMER BLOCK ───────────────────
  {
    num: "07",
    zone: "gpu",
    name: "Transformer block × 80 layers",
    oneLine:
      "Each layer: RMSNorm → GQA Attention → residual → RMSNorm → SwiGLU MLP (or MoE) → residual.",
    stat: "Llama-3 70B · GQA 64:8 · head_dim 128",
    where: {
      hw: "Tensor parallelism across 8 GPUs in one node (e.g. H100 SXM5, 80 GB HBM3 each, 989 TFLOPS BF16). Weights sharded by column.",
      net: "NVLink 4 (900 GB/s bidirectional) for the 2 all-reduces per layer × 80 layers = 160 collectives per forward pass",
      site: "One HGX node: 8 GPUs on one baseboard, sharing NVSwitch fabric. Same physical chassis, ~50cm of copper.",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`for layer in 0..79:
  # ── attention ─────────────────────────────────────
  h = rms_norm(x)
  Q = h @ W_q   # [1, S, 8192] · [8192, 8192]   → 64 query heads × 128 dim
  K = h @ W_k   # [1, S, 8192] · [8192, 1024]   → 8  KV heads (GQA 8:1)
  V = h @ W_v   # [1, S, 8192] · [8192, 1024]   → 8  KV heads
  Q, K = rope(Q, position), rope(K, position)
  KV_cache[layer].append(K, V)                   # ← persistent state
  scores = (Q @ K_cache.T) / sqrt(128)
  scores = scores + causal_mask
  attn   = softmax(scores) @ V_cache             # FlashAttention tiles in SRAM
  x      = x + attn @ W_o

  # ── MLP (or MoE) ──────────────────────────────────
  h = rms_norm(x)
  x = x + (silu(h @ W_gate) * (h @ W_up)) @ W_down   # SwiGLU, intermediate=28,672

# final: rms_norm → lm_head → logits over 128,256 tokens`}</pre>
        <Note>
          Same code path runs in both phases. <Mono>S=4</Mono> at prefill (whole
          prompt in parallel, compute-bound, ~50–70% MFU) → <Mono>S=1</Mono> at
          decode (one token at a time, bandwidth-bound, ~5–15% MFU). For MoE
          models (DeepSeek-V3, Llama 4, GPT-OSS), the MLP step becomes a router
          → top-K expert selection → all-to-all dispatch across the cluster →
          per-expert SwiGLU → all-to-all combine.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 08: KV CACHE ───────────────────
  {
    num: "08",
    zone: "gpu",
    name: "KV cache — what long context costs",
    oneLine:
      "Every K and V projection is kept in HBM so decode doesn't recompute. The cache, not the weights, is what bounds context.",
    stat: "320 KB / token · per request",
    where: {
      hw: "HBM3 / HBM3E stacks soldered next to the GPU die via TSMC CoWoS interposer. 80 GB per H100, 141 GB per H200, 192 GB per B200.",
      net: "Reads stream over the GPU↔HBM link at 3.35 TB/s (H100) or 4.8 TB/s (H200) every decode step",
      site: "Same package as the GPU die — millimeters apart on a silicon interposer",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`per token, per layer (BF16, GQA 8:1):
  K  = 8 KV heads × 128 head_dim × 2 bytes =  2,048 B
  V  = 8 KV heads × 128 head_dim × 2 bytes =  2,048 B
across 80 layers:
  80 × (2,048 + 2,048)                     = 327,680 B  ≈  320 KB / token`}</pre>
        <div>
          <p className={labelClass}>What that means in practice</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                ctx: "Our prompt",
                tok: "4 tokens",
                kv: "1.28 MB",
                tone: "border-emerald-500/20 bg-emerald-500/5",
              },
              {
                ctx: "Claude Code session",
                tok: "50,000 tokens",
                kv: "~16 GB",
                tone: "border-amber-500/20 bg-amber-500/5",
              },
              {
                ctx: "1M-token context",
                tok: "1,000,000 tokens",
                kv: "~320 GB (must shard)",
                tone: "border-rose-500/20 bg-rose-500/5",
              },
            ].map((row) => (
              <div
                key={row.ctx}
                className={`border ${row.tone} rounded-md px-3 py-2`}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                  {row.ctx}
                </p>
                <p className="font-mono text-[11px] text-gray-700 dark:text-gray-300 mt-0.5">
                  {row.tok}
                </p>
                <p className="font-mono text-[12px] text-gray-900 dark:text-gray-100 mt-0.5">
                  → {row.kv}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Note>
          vLLM&apos;s PagedAttention chunks this into 16-token blocks (5 MB
          each), so two requests sharing a 50K prefix point at the same
          physical pages — copy-on-write only on divergence. The cached prefix
          for our request was already resident on this replica from the prior
          turn, which is why prefill skipped 49,950 of those tokens.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 09: LM HEAD + SAMPLE ───────────────────
  {
    num: "09",
    zone: "gpu",
    name: "lm_head → logits → sample",
    oneLine:
      "The final hidden vector is projected back to 128,256 logits. Softmax. Sample. That ID is the next token.",
    stat: "128,256 logits · T ≈ 0.0 for code",
    where: {
      hw: "Final matmul on tensor cores, then softmax + sampling kernel. Often the lm_head matrix is sharded across the same TP group — ends with one all-reduce.",
      net: "NVLink for the all-reduce, then PCIe back to host CPU for the sampled int (sometimes kept on-device)",
      site: "Same HGX node — the sampled token ID hops to the host CPU for stream framing",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`final_hidden    : [1, 1, 8192]                # last token's residual stream
final_hidden    = rms_norm(final_hidden)
logits          = final_hidden @ lm_head.T     # lm_head: [128256, 8192], BF16, 2.10 GB
                                               # → [1, 1, 128256] real-valued

# sampling (Claude Code: T ≈ 0.0 for deterministic code generation)
probs           = softmax(logits / T)
probs           = top_p(top_k(probs, 50), 0.9)
next_token_id   = multinomial(probs, 1)        # → e.g. 40, "I"`}</pre>
        <div>
          <p className={labelClass}>Top-5 candidates after softmax (illustrative)</p>
          <div className="space-y-1">
            {[
              { tok: '"I"', p: 0.61, w: 95 },
              { tok: '"Looking"', p: 0.18, w: 28 },
              { tok: '"Let"', p: 0.09, w: 14 },
              { tok: '"To"', p: 0.05, w: 8 },
              { tok: '"First"', p: 0.03, w: 5 },
            ].map((r) => (
              <div key={r.tok} className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] text-gray-700 dark:text-gray-300 w-20 flex-shrink-0">
                  {r.tok}
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${r.w}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-gray-500 w-10 text-right">
                  {(r.p * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <Note>
          Detokenize: <Mono>tokenizer.decode(40)</Mono> → <Mono>&quot;I&quot;</Mono>.
          Append to output buffer. Loop: pass the new token back through the
          full 80-layer stack — but only the new token, because the KV cache
          carries everything before it. Stop on <Mono>eos_token_id</Mono> or a
          <Mono>tool_use</Mono> block close.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 10: STREAM ───────────────────
  {
    num: "10",
    zone: "stream",
    name: "Server-Sent Events stream back",
    oneLine:
      "Every token is flushed the instant it's sampled. HTTP/2 chunked transfer holds the connection open.",
    stat: "delta per token · ~50–100 ms cadence",
    where: {
      hw: "Frontend pod CPU detokenizes the int → bytes, frames the SSE event, writes to socket. Cloudflare passes the bytes through unchanged.",
      net: "Datacenter VPC → Cloudflare PoP → public internet → your ISP → your laptop NIC. Same TCP connection that opened in step 02.",
      site: "Reverses the path through every layer of step 02–03",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`event: message_start
data: {"type":"message_start","message":{"id":"msg_01ABC...",
       "model":"claude-opus-4-7","usage":{"input_tokens":50012,
       "cache_read_input_tokens":49950,"output_tokens":1}}}

event: content_block_start
data: {"type":"content_block_start","index":0,
       "content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,
       "delta":{"type":"text_delta","text":"I"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,
       "delta":{"type":"text_delta","text":"'ll"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,
       "delta":{"type":"text_delta","text":" start"}}
...`}</pre>
        <Note>
          Each <Mono>text_delta</Mono> is one decoded token. Latency from
          sampler → terminal is sub-100ms; that&apos;s why text appears word by
          word. <Mono>cache_read_input_tokens: 49,950</Mono> is the prompt-cache
          hit being billed at the discounted rate. <Mono>ping</Mono> events
          interleave as keepalives for long generations.
        </Note>
      </div>
    ),
  },

  // ─────────────────── 11: TOOL USE LOOP ───────────────────
  {
    num: "11",
    zone: "client",
    name: "Tool use → execute locally → re-request",
    oneLine:
      "When the model emits a tool_use block, the stream stops, Claude Code runs the tool, and a brand new /v1/messages request goes back out.",
    stat: "10–50+ tool calls per task",
    where: {
      hw: "Your laptop CPU again — Node.js process spawns subshells, reads/writes files on local SSD, then re-opens an HTTPS connection",
      net: "loopback while running the tool · then back out across the public internet for the next request",
      site: "your desk → Cloudflare PoP → AWS/GCP region → GPU node — same loop, ~22 times for our task",
    },
    panel: (
      <div className="space-y-3">
        <pre className={codeBlockClass}>{`event: content_block_start
data: {"type":"content_block_start","index":1,
       "content_block":{"type":"tool_use","id":"toolu_01XYZ",
       "name":"Read","input":{}}}

event: content_block_delta
data: {"delta":{"type":"input_json_delta",
       "partial_json":"{\\"file_path\\":\\"app/glob"}}

event: content_block_delta
data: {"delta":{"type":"input_json_delta",
       "partial_json":"als.css\\"}"}}

event: message_delta
data: {"delta":{"stop_reason":"tool_use"}}

──────────  STREAM CLOSED  ──────────

# Claude Code parses the tool call, runs Read("app/globals.css"),
# appends the result, and fires a NEW request:

POST /v1/messages
{
  "messages": [
    ...prior 50K tokens...,
    { "role": "assistant", "content": [{ "type": "tool_use", ... }] },
    { "role": "user",
      "content": [{ "type": "tool_result",
                    "tool_use_id": "toolu_01XYZ",
                    "content": "@tailwind base;\\n@tailwind ..." }] }
  ]
}

→ back to step 03. The prefix is still cached. Loop.`}</pre>
        <Note>
          Each turn is a stateless forward pass. The illusion of continuous
          reasoning is the loop, not the model. Seven file edits and four
          minutes of wall-clock time later, the conversation history has grown
          by ~80K tokens, the model has been called ~22 times, and the
          prompt-cache hit rate stayed above 88%.
        </Note>
      </div>
    ),
  },
];

export function RequestPath(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Inference Request Path — full stack
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          What literally happens to <span className="font-mono text-gray-700 dark:text-gray-300">&quot;add dark mode functionality&quot;</span>{" "}
          on its way to the GPU and back.
        </p>
      </div>

      {/* Zone legend */}
      <div className="px-6 py-3 flex flex-wrap gap-x-5 gap-y-2 border-b border-gray-200 dark:border-gray-800">
        {Object.values(zoneMeta).map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <span className={`${z.dot} w-1.5 h-1.5 rounded-full`} />
            <span className="text-[10px] text-gray-500 font-mono">
              {z.label}
            </span>
          </div>
        ))}
      </div>

      {/* Stations */}
      <div className="px-3 sm:px-6 py-5 space-y-4">
        {stations.map((s, i) => {
          const meta = zoneMeta[s.zone];
          return (
            <div key={s.num}>
              <div
                className={`border ${meta.ring} rounded-lg bg-white dark:bg-gray-950/40 overflow-hidden`}
              >
                {/* Station header bar */}
                <div className="flex items-start justify-between gap-4 px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800/60">
                  <div className="flex items-baseline gap-3 flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-gray-400 pt-0.5">
                      {s.num}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`${meta.dot} w-1.5 h-1.5 rounded-full`} />
                      <span
                        className={`${meta.text} font-mono text-[11px] font-medium uppercase tracking-wider`}
                      >
                        {s.name}
                      </span>
                    </div>
                  </div>
                  {s.stat && (
                    <span className="font-mono text-[10px] text-gray-500 whitespace-nowrap pt-0.5 hidden sm:inline">
                      {s.stat}
                    </span>
                  )}
                </div>

                {/* One-liner */}
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800/60">
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {s.oneLine}
                  </p>
                  {s.stat && (
                    <p className="font-mono text-[10px] text-gray-500 mt-1 sm:hidden">
                      {s.stat}
                    </p>
                  )}
                </div>

                {/* Where — physical location */}
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/60 dark:bg-gray-900/40">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
                    Where it runs
                  </p>
                  <dl className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1 text-[10.5px]">
                    <dt className="font-mono text-gray-400">hw</dt>
                    <dd className="text-gray-700 dark:text-gray-300 leading-snug">
                      {s.where.hw}
                    </dd>
                    <dt className="font-mono text-gray-400">net</dt>
                    <dd className="text-gray-700 dark:text-gray-300 leading-snug">
                      {s.where.net}
                    </dd>
                    <dt className="font-mono text-gray-400">site</dt>
                    <dd className="text-gray-700 dark:text-gray-300 leading-snug">
                      {s.where.site}
                    </dd>
                  </dl>
                </div>

                {/* Detail panel */}
                <div className="px-4 py-3">{s.panel}</div>
              </div>

              {i < stations.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <span className="text-gray-400 font-mono text-[12px]">↓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/70">
        <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mr-2">
            What this trace shows
          </span>
          The interesting cost is concentrated at steps 07 and 08. Everything
          above is plumbing the industry has been optimizing for thirty years;
          everything below is application logic. The 80 transformer layers and
          their KV cache are the part that needs HBM bandwidth, NVLink scale-up,
          and fab capacity — and the part the rest of this post is about.
        </p>
      </div>
    </div>
  );
}

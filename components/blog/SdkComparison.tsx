export function SdkComparison(): React.ReactElement {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without SDK */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-red-50 dark:bg-red-950/20 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Without the SDK
            </span>
          </div>
          <div className="p-4">
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre overflow-x-auto leading-relaxed"><code>{`import boto3, json, concurrent.futures

bedrock = boto3.client("bedrock-runtime")

def call_bedrock(item):
    body = json.dumps({
        "anthropic_version": "bedrock-2023-10-25",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": build_prompt(item)
        }]
    })
    resp = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet...",
        body=body
    )
    result = json.loads(
        resp["body"].read()
    )
    return json.loads(
        result["content"][0]["text"]
    )

results = []
with concurrent.futures.ThreadPoolExecutor(
    max_workers=60
) as executor:
    futures = {
        executor.submit(call_bedrock, item): item
        for item in email_records
    }
    for future in concurrent.futures.as_completed(
        futures
    ):
        try:
            results.append(future.result())
        except Exception as e:
            # retry logic, backoff, etc.
            handle_retry(futures[future], e)`}</code></pre>
          </div>
        </div>

        {/* With SDK */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-green-50 dark:bg-green-950/20 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              With the SDK
            </span>
          </div>
          <div className="p-4">
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre overflow-x-auto leading-relaxed"><code>{`results = llm.parallel(
    items=email_records,
    prompt_func=process_email,
    max_workers=60,
)`}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}

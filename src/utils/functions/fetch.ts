export async function fetchWrapper<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  const data = await fetch(`${input}`, init);

  if (!data.ok) {
    return;
  }

  // Check if the response is empty
  const text = await data.text();
  let result;
  if (text.length) {
    result = JSON.parse(text);
  } else {
    result = {};
  }

  return result as T;
}

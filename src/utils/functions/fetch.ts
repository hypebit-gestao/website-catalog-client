export async function fetchWrapper<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/${input}`,
    init
  );

  if (!data.ok) {
    return;
  }

  console.log("Data: ", data);

  // Check if the response is empty
  const text = await data.text();

  let result;
  if (text.length) {
    result = JSON.parse(text);
  } else {
    result = {};
  }
  console.log("Result: ", result);

  return result as T;
}

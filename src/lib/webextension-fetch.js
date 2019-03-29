import browser from 'webextension-polyfill';

const serializeResponse = async response => {
	const {status, statusText, headers} = response;

	const serializedResponse = {status, statusText, headers: {}};

	for (const [header, value] of headers.entries()) {
		serializedResponse.headers[header] = value;
	};

	serializedResponse.body = [...new Uint8Array(await response.arrayBuffer())];

	return serializedResponse;
};

const deserializeResponse = serializedResponse => {
	const body = new Uint8Array(serializedResponse.body);
	const response = new Response(body, serializedResponse);

	return response;
};

const webextensionFetch = async (input, init) => {
	const serializedResponse = await browser.runtime.sendMessage({
		contentScriptQuery: 'webextension-fetch',
		input,
		init
	});

	return deserializeResponse(serializedResponse);
};

webextensionFetch.listen = () => {
	browser.runtime.onMessage.addListener(async ({contentScriptQuery, input, init}) => {
		if (contentScriptQuery === 'webextension-fetch') {
			const response = await fetch(input, init);

			return await serializeResponse(response);
		}
	});
};

export default webextensionFetch;

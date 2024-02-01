import EventSource from "eventsource";

const BASE_URL = 'https://app.customgpt.ai/api/v1/projects';

export class CustomGPTClient {

    constructor (projectId, token) {
        this.projectId = projectId;
        this.token = token;
    }

    get baseUrl () {
        return `${BASE_URL}/${this.projectId}`;
    }
    get authenticationHeader () {
        return {
            'authorization': `Bearer ${this.token}`,
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'
        }
    }

    async makeRequest (url, options) {
        console.log(url, options);
        const response = await fetch(url, options);
        const json = await response.json();
        console.log(json);
        return json;
    }

    createConversation (conversationName) {
        return this.makeRequest(`${this.baseUrl}/conversations`, {
            headers: {...this.authenticationHeader, ...{ 'content-type': 'application/json', 'accept': 'application/json' }},
            method: 'POST',
            body: JSON.stringify({ name: 'coucou' })
        });
    }

    async sendMessageToConversation (conversationData, messageContent) {
        const url = `${this.baseUrl}/conversations/${conversationData.session_id}/messages?stream=0`;
        return this.makeRequest(url, {
            headers: {...this.authenticationHeader, ...{ 'content-type': 'application/json', 'accept': 'application/json' }},
            method: 'POST',
            body: JSON.stringify({ prompt: messageContent })
        });
    }

}

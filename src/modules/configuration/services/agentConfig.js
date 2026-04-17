import axios from "axios";

export function getPrincipalConfiguration(){
	return axios.get(`/api/configuration/agents`)
}

export function toggleState(idAgent){
	return axios.post(`/api/configuration/agents/${idAgent}/state`)
}

export function createAgentIa(payload){
	return axios.post(`/api/configuration/agents`, payload)
}

export function getEmbeddings(){
	return axios.get(`/api/configuration/agents/select-embeddings`)
}

export function getConversational(){
	return axios.get(`/api/configuration/agents/select-conversational`)
}

export function getPrompt(){
	return axios.get(`/api/configuration/agents/select-system-prompt`)
}

export function deleteAgent(idAgent){
	return axios.delete(`/api/configuration/agents/${idAgent}`)
}


export function getAgentById(idAgent){
	return axios.get(`/api/configuration/agents/${idAgent}`)
}

export function updateAgentIa(idAgent, payload) {
    return axios.put(`/api/configuration/agents/${idAgent}`, payload)
}

export function getListEmbeddings(){
	return axios.get(`/api/configuration/agents/embeddings`)
}


export function createEmbedding(payload){
	return axios.post(`/api/configuration/agents/embeddings`, payload)
}

export function getListLLM(){
	return axios.get(`/api/configuration/agents/agent-conversational`)
}

export function createLLMs(payload){
	return axios.post(`/api/configuration/agents/agent-conversational`, payload)
}
export function getListPrompts(){
	return axios.get(`/api/configuration/agents/prompts`)
}

export function createPrompts(payload){
	return axios.post(`/api/configuration/agents/prompts`, payload)
}
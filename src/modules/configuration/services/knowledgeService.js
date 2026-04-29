import axios from "axios";

const baseURL = (axios.defaults.baseURL || "").replace(/\/+$/, "");
const hasApiInBaseURL = baseURL.endsWith("/api");
const API_PREFIX = `${hasApiInBaseURL ? "" : "/api"}/configuration/conocimiento`;

const HEADQUARTER_URL = `${API_PREFIX}/headquarters`;
const KNOWLEDGE_URL = `${API_PREFIX}/headquarter/knowledge`;
const KNOWLEDGE_CREATE_URL = `${KNOWLEDGE_URL}/create`;
const DOC_CREATE_URL = `${KNOWLEDGE_URL}/doc/create`;

function resolveFileUrl(filePath) {
  if (!filePath) return "";
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const apiBase = (axios.defaults.baseURL || import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");
  const cleanPath = String(filePath).replace(/^\/+/, "");
  return apiBase ? `${apiBase}/${cleanPath}` : `/${cleanPath}`;
}

function extractFileFromPayload(payload) {
  if (payload?.file instanceof File) return payload.file;
  if (payload?.file?.raw instanceof File) return payload.file.raw;
  return null;
}

function buildDocFormData(idKnowledge, payload, file) {
  const formData = new FormData();
  formData.append("name", payload?.name ?? "");
  formData.append("file", file);
  formData.append("idKnowledge", String(idKnowledge));
  return formData;
}

function normalizeHeadquartersResponse(payload) {
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const normalized = rows.map((row) => ({
    idHeadquarter: row?.idHeadquarter ?? null,
    name: row?.name ?? "",
    categories: Number(row?.categories ?? 0),
    docs: Number(row?.docs ?? 0),
    state: typeof row?.state === "number" ? row.state : 1,
  }));

  return { ...payload, data: normalized };
}

function normalizeHeadquarterDetailResponse(payload) {
  const detail = payload?.data ?? {};
  const categories = Array.isArray(detail?.Categories)
    ? detail.Categories
    : Array.isArray(detail?.headquarterKnowledges)
      ? detail.headquarterKnowledges
      : [];

  const normalizedCategories = categories.map((category) => {
    const docs = Array.isArray(category?.Docs)
      ? category.Docs
      : Array.isArray(category?.docs)
        ? category.docs
        : [];

    return {
      idKnowledge: category?.IdKnowledge ?? category?.idKnowledge ?? category?.id ?? null,
      title: category?.Title ?? category?.title ?? "",
      description: category?.Description ?? category?.description ?? null,
      state: category?.State ?? category?.state ?? 0,
      docs: docs.map((doc) => ({
        idDoc: doc?.IdDoc ?? doc?.idDoc ?? doc?.id ?? null,
        name: doc?.Name ?? doc?.name ?? "",
        state: doc?.State ?? doc?.state ?? 0,
        file: resolveFileUrl(doc?.File ?? doc?.file ?? ""),
        createdAt: doc?.CreatedAt ?? doc?.createdAt ?? null,
      })),
    };
  });

  return {
    ...payload,
    data: {
      idHeadquarter: detail?.idHeadquarter ?? null,
      nameHeadquarter: detail?.NameHeadquarter ?? detail?.nameHeadquarter ?? "",
      headquarterKnowledges: normalizedCategories,
    },
  };
}

export async function getHeadquarters() {
  const response = await axios.get(HEADQUARTER_URL);
  return {
    ...response,
    data: normalizeHeadquartersResponse(response.data),
  };
}

export function changeHeadquarterStateById(idHeadquarter) {
  return axios.put(`${API_PREFIX}/headquarter/${idHeadquarter}/change-state`);
}

export async function getHeadquarterKnowledgeList(idHeadquarter) {
  const idParam = idHeadquarter === null ? "general" : idHeadquarter;
  const response = await axios.get(`${API_PREFIX}/headquarter/${idParam}/list`);

  return {
    ...response,
    data: normalizeHeadquarterDetailResponse(response.data),
  };
}

export function createHeadquarterKnowledge(payload) {
  return axios.post(KNOWLEDGE_CREATE_URL, payload);
}

export function updateHeadquarterKnowledgeById(idKnowledge, payload) {
  return axios.put(`${KNOWLEDGE_URL}/${idKnowledge}/edit`, payload);
}

export function changeHeadquarterKnowledgeStateById(idKnowledge) {
  return axios.put(`${KNOWLEDGE_URL}/${idKnowledge}/change-state`);
}

export function deleteHeadquarterKnowledgeById(idKnowledge) {
  return axios.delete(`${KNOWLEDGE_URL}/${idKnowledge}/delete`);
}

export async function createKnowledgeDocByIdKnowledge(idKnowledge, payload) {
  const file = extractFileFromPayload(payload);
  if (!file) {
    throw new Error("Debes seleccionar un archivo PDF valido");
  }

  const formData = buildDocFormData(idKnowledge, payload, file);
  return axios.post(DOC_CREATE_URL, formData);
}

export function changeDocStateById(idDoc) {
  return axios.put(`${KNOWLEDGE_URL}/doc/${idDoc}/change-state`);
}

export function deleteDocById(idDoc) {
  return axios.delete(`${KNOWLEDGE_URL}/doc/${idDoc}/delete`);
}

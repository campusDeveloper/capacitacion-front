import { ElNotification } from 'element-plus'
import { useErrors } from "../shared/store/errors";

export async function request(fn, notify) {
	let data = null;
	let error = null;

	const parseNotify = (notify) => {
		if (typeof notify === "boolean") {
			return { success: notify, error: notify };
		}
		return {
			success: notify?.success ?? true,
			error: notify?.error ?? true,
		};
	};

	try {
		const response = await fn();
		data = response.data;
		const method = response.config.method;
		const title = data?.title ?? "Exito!";
		const type = data?.type ?? "success";
		const message = data?.message;

		const notifyConfig = parseNotify(notify);

		// Notificación de éxito
		if (notifyConfig.success && method !== "get") {
			ElNotification({
				title,
				message,
				type,
			});
		}
	} catch (e) {
		data = e.data;
		const title =
			e?.error?.tittle ??
			e.response?.data?.title ??
			"Error!";
		const message =
			e.response?.data?.errors?.root?.[0] ??
			e?.error?.message ??
			e.response?.data?.message ??
			e.response?.data?.error ??
			e?.message ??
			e?.error?.error ??
			e?.error ??
			Object.values(e?.errors)?.[0]?.[0];

		const method = e.response?.config?.method || "unknown";
		const status = e.response?.status;

		const notifyConfig = parseNotify(notify);

		if (notifyConfig.error && method !== "get") {
			if (status == 422) {
				ElNotification({
					title: title,
					message: e.response?.data?.error,
					type: "error",
				});
			} else {
				ElNotification({
					title: title,
					message: message,
					type: "error",
				});
			}
		}

		const { setErrors } = useErrors();
		setErrors(e.errors);

		error = e;
	}
	return { data, error };
}

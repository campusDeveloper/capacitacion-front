import { ElNotification } from "element-plus";

export const notify = {
    success(message: string, title = "Correcto") {
        ElNotification({
            title,
            message,
            type: "success",
            duration: 2500
        });
    },

    warning(message: string, title = "Advertencia") {
        ElNotification({
            title,
            message,
            type: "warning",
            duration: 3000
        });
    },

    error(message: string, title = "Error") {
        ElNotification({
            title,
            message,
            type: "error",
            duration: 3500
        });
    },

    info(message: string, title = "Información") {
        ElNotification({
            title,
            message,
            type: "info",
            duration: 2500
        });
    }
};

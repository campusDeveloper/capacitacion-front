export async function FileToBase64(File){
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(File);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}
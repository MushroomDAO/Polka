const LOGGING_ENABLED = false;

const LOGBRO = (...message) => {
	if (!LOGGING_ENABLED) return;

	console.log(message);
};

export default LOGBRO;

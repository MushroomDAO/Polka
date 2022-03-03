const LOGGING_ENABLED = true;

const LOGBRO = (...message) => {
	if (!LOGGING_ENABLED) return;

	console.log(message);
};

export default LOGBRO;

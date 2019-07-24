// Initialize Identity Platform Configuration
var config = {
	apiKey: {{ $.firebase_config.ApiKey }},
	authDomain: {{ $.firebase_config.AuthDomain }},
	projectId: {{ $.firebase_config.ProjectId }}
};
firebase.initializeApp(config);

class SceneManager {
	constructor() {
		this.actualScene = 0;
		this.scenes = [];
	}

	addScene = function(sceneContainer) {
		this.scenes.push(sceneContainer);
	};

	getNextScene = function() {
		this.checkNextScene();
		return this.scenes[this.actualScene];
	};

	getActualScene = function() {
		return this.scenes[this.actualScene];
	};

	checkNextScene = function() {
		if (this.actualScene >= this.scenes.length - 1) {
			this.actualScene = -1;
		}
		this.actualScene++;
	};
}

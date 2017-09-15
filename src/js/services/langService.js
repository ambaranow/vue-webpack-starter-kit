let lng = false;
let instance = false;

// Сервис определяющий язык, по сути является заглушкой так как у нас нет мультиязычности
class LangService {
	constructor() {
		if(!instance){
			instance = this;
		}
		this.setCurrentLang();
		return instance;
	}
	setCurrentLang() {
		if (!lng) {
			lng = document.documentElement.lang;
			lng = lng ? lng : 'ru';
		}
		return lng;
	};
	get() {
		return lng;
	};
};

let langService = new LangService();

export default langService
import axios from 'axios';
import LangService from 'Services/langService'

let instance = null;

// Класс работающий с API

class ApiService {
	constructor() {
		if (!instance) {
			instance = this;
		}
		return instance;
	}

	/**
	 * Проставляет параметры в url
	 * @param url - ссылка в которую нужно прописать параметры
	 * @param params - Объект с параметрами
	 * @return {*}
	 */
	placeParamsInUrl(url, params = {}) {
		var killArray = [];
		Object.keys(params).forEach((value, key) => {
			if (url.indexOf('\%' + key + '\%') > -1) {
				url = url.replace('\%' + key + '\%', value);
				if (killArray.indexOf(key) < 0) {
					killArray.push(key);
				}
			}
		});
		for (var i = 0; i < killArray.length; i++) {
			delete params[killArray[i]];
		}

		// add lang support
		if (url.indexOf('\[lang\]') > -1) {
			url = url.replace('\[lang\]', LangService.get());
		}
		return url;
	}

	/**
	 * Отправляет get запрос в API
	 * @param url
	 * @param params
	 * @return {AxiosPromise}
	 */
	getData(url, params) {
		url = this.placeParamsInUrl(url, params)
		return axios.get(url, {
			params: params
		})
	}

	/**
	 * Отправляет post запрос в API
	 * @param url
	 * @param params
	 * @return {AxiosPromise}
	 */
	postData(url, params) {
		url = this.placeParamsInUrl(url, params)
		return axios.post(url, params)
	}
}

export default new ApiService()


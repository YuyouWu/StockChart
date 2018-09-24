import axios from 'axios';

export function getTickers() {
	axios.get('/portfolio').then(function (res){
		return(res.data.tickers);
	}).catch(function(err){
		return(err);
	});
}


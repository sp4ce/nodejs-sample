exports.index = function(req, res, next){
	res.render('index');
}

exports.show = function(req, res, next){
	res.render('show', { note: 'coucou' });
};

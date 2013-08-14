exports.show = function(req, res, next){
	res.render('show', { note: 'coucou' });
};
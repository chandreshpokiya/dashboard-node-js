const setFlash = (req,res,next) => {
  res.locals.flash = {
    'success': req.flash('success'),
    'error': req.flash('error'),
  }
  return next();
}


export default setFlash;
function toggleFullScreen(src) {
  if(src == null) {
    $('#image-wrapper').attr('style', 'display: none;');
  }
  else {
    $('#image-wrapper').attr('style', '');
    $('#image-wrapper img').attr('src', src);
  }
}d
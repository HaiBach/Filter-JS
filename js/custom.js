/**
 * CUSTOM JS
 * Add class to parent, have $inputAll
 */
(function($) {
  // $(document).ready(function() {
  $(window).load(function() {
    var $inputAll = $('.listFields #all');
    var $input = $('.listFields input[type=checkbox]').not($inputAll);
    var classActive = 'active';
    
    $input.add($inputAll).on('change', function() {
      var $this = $(this);
      var $li = $this.closest('li');
      // Toggle class 'active'
      $li[this.checked === true ? 'addClass' : 'removeClass'](classActive);

      if( !$this.is($inputAll) && this.checked === true ) {
        $inputAll.closest('li').removeClass(classActive);
      }
      if( $this.is($inputAll) ) {
        $input.closest('li').removeClass(classActive);
      }
    })
    .each(function() {
      var $li = $(this).closest('li');
      // Toggle class 'active'
      $li[this.checked === true ? 'addClass' : 'removeClass'](classActive);
    });
  });
})(jQuery);
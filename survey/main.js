(function() {
  'use strict';
  document.querySelectorAll('.radio-btn').forEach(n => {
    n.addEventListener('change', function() {
      console.log(this.checked);
      if (this.checked) {
        document.querySelectorAll('.radio-btn').forEach(n => n.closest('li').style.border = '1px solid #e1e3e9');
        this.closest('li').style.border = '1px solid #3c99fc';
      } else {
        this.closest('li').style.border = '1px solid #e1e3e9';
      }
    });
  });
  document.querySelectorAll('.checkbox-block').forEach(n => {
    n.addEventListener('change', function() {
      if (this.checked) {
        this.closest('li').style.border = '1px solid #3c99fc';
      } else {
        this.closest('li').style.border = '1px solid #e1e3e9';
      }
    });
  });
  document.getElementById('comments').addEventListener('keyup', function() {
    if (this.offsetHeight < this.scrollHeight) {
      this.style.height = `${this.scrollHeight + 2}px`;
    } else if (!this.value) {
      this.style.height = `52px`;
    }
  });
})();
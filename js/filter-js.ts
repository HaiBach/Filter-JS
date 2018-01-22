/**
 * FILTER PURN JAVASCRIPT PLUGIN
 * @browserSupport: IE9+
 */
'use strict';
(function() {

  /**
   * CLASS FILTER JS
   */
  class FilterJS {
    constructor(selector: string) {
      var $filters: any = document.querySelectorAll(selector);
      for( let i = 0, len = $filters.length; i < len; i++ ) {
        new FilterJSOne($filters[i]);
      }
    }
  }
  // Assign Class to Global variable
  window.FilterJS = FilterJS;


  /**
   * CLASS FILTER JS ONE
   * Ho tro nhieu filter tren cung 1 trang
   */
  class FilterJSOne {
    constructor($filter: any) {

      // Variable Initial
      this.$filter = $filter;
      let selectorInputAll: string = $filter.getAttribute('data-input-all') || false;
      let selectorInput: string = $filter.getAttribute('data-input') || false;
      let selectorTarget: string = $filter.getAttribute('data-target') || false;

      this.$inputAll = $filter.querySelector(selectorInputAll) || document.createElement('div');
      this.$inputs = this.ConvertNode($filter.querySelectorAll(selectorInput));
      this.$targets = this.ConvertNode($filter.querySelectorAll(selectorTarget));
      this.$targetChecked = [];

      // Remove $inputAll out $input
      this.$inputs = this.Not(this.$inputs, this.$inputAll);

      // Setup checked all at begin
      this.CheckedAllAtBegin();
      // Event Chagne on Inputs
      this.EventChange();
    }

    private ConvertNode($nodes: any) {
      let $nodesNew = [];
      for( let i = 0, len = $nodes.length; i < len; i++ ) {
        $nodesNew.push($nodes[i]);
      }
      return $nodesNew;
    }
    private ConvertPercent(str: string, $nodeSize: any) {
      let re = /\d+\.?\d*\%/g,
          match = str.match(re),
          vConvert, valueCur;

      for( let key in match ) {
        vConvert = parseFloat(match[key].replace('%', ''), 10);
        vConvert = $nodeSize.offsetWidth * vConvert / 100;

        str = str.replace(match[key], vConvert);
      }
      return eval(str);
    }
    private Find($nodes: any, selector: string): any {
      let $nodesNew = [];
      for( let i = 0, len = $nodes.length; i < len; i++ ) {
        let $nodesQuery = $nodes[i].querySelectorAll(selector);
        
        for( let j = 0, lenJ = $nodesQuery.length; j < lenJ; j++ ) {
          $nodesNew.push($nodesQuery[j]);
        }
      }
      return $nodesNew.length ? $nodesNew : null;
    }
    private Not($nodes: any, $nodesRemove: any): any {
      // Chuyen doi single $node sang array $node
      if( $nodesRemove.nodeType === 1 ) $nodesRemove = [$nodesRemove];

      // Copy $node to other array[]
      let $nodes1: any[] = [];
      for( let key in $nodes ) {
        $nodes1.push($nodes[key]);
      }

      // Vong lap: setup tung $nodeRemove
      for( let key in $nodesRemove ) {
        let index: number = $nodes.indexOf($nodesRemove[key]);
        if( index !== -1 ) {
          $nodes1.splice(index, 1);
        }
      }
      return $nodes1;
    }
    private HasClass($nodes: any, strClass: string): boolean {
      // Chi thuc hien voi Node dau tien
      if( !!$nodes.length ) $nodes = $nodes[0];

      // Bien
      let aClassOnNode = ($nodes.getAttribute('class') || '').split(' ');
      let isHas = false;

      for( var key in aClassOnNode ) {
        if( aClassOnNode[key] === strClass ) {
          isHas = true;
        }
      }
      return isHas;
    }
    private AddClass($nodes: any, strClass: string): void {
      let arrClass = strClass.split(' ');

      // Dieu kien thuc hien tiep
      if( $nodes === undefined ) return;
      // Convert one node to array
      if( !!$nodes.nodeType ) $nodes = [$nodes];

      // Loop to get all node in array
      for( let i = 0, len = $nodes.length; i < len; i++ ) {
        let $nodeCur = $nodes[i];
        let classOnNode = $nodeCur.getAttribute('class') || '';
        let aClassOnNode = classOnNode.split(' ');
        let isAddClass = false;

        for( let key in arrClass ) {
          if( aClassOnNode.indexOf(arrClass[key]) === -1 ) {
            classOnNode += ' ' + arrClass[key];
            isAddClass = true;
          }
        }

        // Add class on Node
        if( isAddClass ) {
          classOnNode = classOnNode.replace(/(^\s+)|(\s+$)/g, '').replace(/\s\s+/g, ' ');
          $nodeCur.setAttribute('class', classOnNode);
        }
      }
    }
    private RemoveClass($nodes: any, strClass: string): void {
      let arrClass = strClass.split(' ');

      // Dieu kien thuc hien tiep
      if( $nodes === undefined ) return;
      // Convert one node to array
      if( !!$nodes.nodeType ) $nodes = [$nodes];

      // Loop to get all node in array
      for( let i = 0, len = $nodes.length; i < len; i++ ) {
        let $nodeCur = $nodes[i];
        let classOnNode = $nodeCur.getAttribute('class') || '';
        let aClassOnNode = classOnNode.split(' ');
        let isRemoveClass = false;

        // Support remove multi class
        for( let key in arrClass ) {
          for( let keyA in aClassOnNode ) {
            if( aClassOnNode[keyA] === arrClass[key] ) {
              aClassOnNode.splice(keyA, 1);
              isRemoveClass = true;
            }
          }
        }

        // Remove class from Node
        if( isRemoveClass ) {
          // Remove whitespce
          classOnNode = aClassOnNode.join(' ');
          classOnNode = classOnNode.replace(/(^\s+)|(\s+$)/g, '').replace(/\s\s+/g, ' ');
          classOnNode === '' ? $nodeCur.removeAttribute('class')
                             : $nodeCur.setAttribute('class', classOnNode);
        }
      }
    }
    private CSS($nodes: any, styles: object): void {
      // Convert to Array
      if( !!$nodes.nodeType ) $nodes = [$nodes];

      // Loop to get all Element in Array
      for( let i = 0, len = $nodes.length; i < len; i++ ) {
        let $nodeCur = $nodes[i];
        for( let key in styles ) {
          $nodeCur.style[key] = styles[key];
        }
      }
    }




    private EventChange(): void {
      var that = this;

      // Setup EventChagne on each $input
      for( let key in this.$inputs ) {
        this.$inputs[key].addEventListener('change', function() {
          let $checked = that.InputChecked();

          // Reset $targetChecked
          that.$targetChecked = [];

          // Remove checked on $inputAll
          if( this.checked === true ) that.$inputAll.checked = false;

          // Get $target has category checked in each $inputChecked
          for( let key in $checked ) {
            let categoryCur = $checked[key].value || false;
            that.TargetChecked(categoryCur);
          }
          // console.log(that.$targetChecked);
          // Show $target
          that.ShowTarget();
        });
      }


      // Setup EventChange on $inputAll
      this.$inputAll.addEventListener('change', function() {
        that.CheckedAll();
      });
    }

    private InputChecked(): any {
      this.$inputChecked = [];
      for( let key in this.$inputs ) {
        // Push $input checked into Array[]
        if( this.$inputs[key].checked === true ) {
          this.$inputChecked.push(this.$inputs[key]);
        }
      }
      // Return $input checked
      return this.$inputChecked;
    }
    // Get $target has category on $intput checked
    private TargetChecked(category: string): any {
      for( let key in this.$targets ) {
        // Get & convert to array category on $target Item
        let $targetCur: any = this.$targets[key];
        let targetCat: string = $targetCur.getAttribute('data-category') || '';
        targetCat = targetCat.split(' ');

        // Kiem tra $target co trung category khong
        if( targetCat.indexOf(category) !== -1 ) {
          // Only push $target not in array[]
          if( this.$targetChecked.indexOf($targetCur) === -1 ) {
            this.$targetChecked.push($targetCur);
          }
        }
      }
    }
    private CheckedAll(): void {
      // Reset $targetChecked
      this.$targetChecked = [];

      if( this.$inputAll.checked === true ) {
        // Select all $target  
        for( let key in this.$targets ) {
          this.$targetChecked.push(this.$targets[key]);
        }

        // Remove checked in all $input
        for( let key in this.$inputs ) {
          this.$inputs[key].checked = false;
        }
      }
      // Show $target
      this.ShowTarget();
      // console.log(this.$targetChecked);
    }
    // Check All at Begin
    private CheckedAllAtBegin(): void {
      if( this.$inputAll.checked === true ) {
        this.CheckedAll();
      }
    }
    // Show $target after $input change
    private ShowTarget(): void {
      let $targetHide: any[] = this.Not(this.$targets, this.$targetChecked);

      // Toggle $target
      for( let key in $targetHide ) {
        this.CSS($targetHide[key], { display: 'none' });
      }
      for( let key in this.$targetChecked ) {
        this.CSS(this.$targetChecked, { display: '' });
      }
    }
  }
})();


// Initial Filter
document.addEventListener('DOMContentLoaded', function() {
  let filters: any = new FilterJS('.filterjs');
});
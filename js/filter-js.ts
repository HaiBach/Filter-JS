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
  (<any>window).FilterJS = FilterJS;


  /**
   * CLASS FILTER JS ONE
   * Ho tro nhieu filter tren cung 1 trang
   */
  class FilterJSOne {
    $filter: any;
    $inputAll: any;
    $inputs: any;
    $targets: any;
    $reset: any;
    $inputChecked: any[] = [];
    $inputCheckedInit: any[] = [];
    $targetChecked: any[] = [];

    constructor($filter: any) {

      // Variable Initial
      this.$filter = $filter;
      let selectorInputAll: string = $filter.getAttribute('data-input-all') || false;
      let selectorInput: string = $filter.getAttribute('data-input') || false;
      let selectorTarget: string = $filter.getAttribute('data-target') || false;
      let selectorReset: string = $filter.getAttribute('data-reset') || false;

      this.$inputAll = $filter.querySelector(selectorInputAll) || document.createElement('div');
      this.$inputs = this.ConvertNode($filter.querySelectorAll(selectorInput));
      this.$targets = this.ConvertNode($filter.querySelectorAll(selectorTarget));
      this.$reset = $filter.querySelector(selectorReset) || document.createElement('div');

      // Remove $inputAll out $input
      this.$inputs = this.Not(this.$inputs, this.$inputAll);

      // Luu tru $inputChecked luc ban dau
      this.$inputCheckedInit = this.$inputChecked = this.GetInputChecked();
      // Hien thi doi tuong $target luc ban dau
      this.SetTargetChecked();
      // Event Chagne tren $inputs
      this.EventChange();
      // Event Tap tren $reset
      this.EventTap();
    }

    private ConvertNode($nodes: any) {
      let $nodesNew = [];
      for( let i = 0, len = $nodes.length; i < len; i++ ) {
        $nodesNew.push($nodes[i]);
      }
      return $nodesNew;
    }
    private ConvertPercent(str: any, $nodeSize: any) {
      let re: any = /\d+\.?\d*\%/g;
      let match: any = str.match(re);
      let vConvert, valueCur;

      for( let key in match ) {
        vConvert = parseFloat(match[key].replace('%', ''));
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
      let $result: any[] = [];

      // Vong lap: setup tung $nodeRemove
      for( let key in $nodes ) {
        if( $nodesRemove.indexOf($nodes[key]) === -1 ) {
          $result.push($nodes[key]);
        }
      }
      return $result;
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
    private CSS($nodes: any, styles: any): void {
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




    // Event Change tren $inputs
    private EventChange(): void {
      var that = this;

      // Setup EventChagne on each $input
      for( let key in this.$inputs ) {
        this.$inputs[key].addEventListener('change', function(this: any) {
          
          // Remove checked on $inputAll
          if( this.checked === true ) that.$inputAll.checked = false;
          // Lay doi tuong $inputs checked
          that.$inputChecked = that.GetInputChecked();

          // Hien thi cac doi tuong $target checked
          that.SetTargetChecked();
        });
      }


      // Setup EventChange on $inputAll
      this.$inputAll.addEventListener('change', function() {
        // Lay doi tuong $inputAll
        that.$inputChecked = [ that.$inputAll ];
        // Hien thi cac doi tuong $target checked
        that.SetTargetChecked();
      });
    }
    // Event Tap tren button Reset
    private EventTap(): void {
      let that = this;

      /**
       * EVENT TAP TREN BUTTON $RESET
       */
      this.$reset.addEventListener('click', function(e: any) {

        // Loai bo checked tren cac $inputs khong co checked luc dau
        let $inputNotChecked = that.Not(that.$inputs, that.$inputCheckedInit);
        for( let key in $inputNotChecked ) {
          $inputNotChecked[key].checked = false;
        }
        // Set checked tren luu tru luc ban dau
        for( let key in that.$inputCheckedInit ) {
          that.$inputCheckedInit[key].checked = true;
        }

        // Lay doi tuong $input checked
        that.$inputChecked = that.$inputCheckedInit;
        // Hien thi cac doi tuong $target checked
        that.SetTargetChecked();

        // Don't add URL with href="#" - Stop Hash(#)
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
      });
    }
    private GetInputChecked(): any {
      let $inputChecked: any[] = [];
      
      // Truong hop: InputAll checked
      if( this.$inputAll.checked === true ) {
        $inputChecked.push(this.$inputAll);
        // Loai bo checked o khac $inputs khac
        for( let key in this.$inputs ) {
          this.$inputs[key].checked = false;
        }
      }
      // Truong hop: InputAll no check
      // Them $inputChecked vao danh sach
      else {
        for( let key in this.$inputs ) {
          if( this.$inputs[key].checked === true ) {
            $inputChecked.push(this.$inputs[key]);
          }
        }
      }
      return $inputChecked;
    }
    // Get $target has category on $intput checked
    private GetTargetChecked(category: string): any {
      for( let key in this.$targets ) {
        // Get & convert to array category on $target Item
        let $targetCur: any = this.$targets[key];
        let targetCat: any = $targetCur.getAttribute('data-category') || '';
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
    private SetTargetChecked(): void {
      // Reset $targetChecked
      this.$targetChecked = [];

      /**
       * TRUONG HOP: $INPUTALL CHECKED
       */
      if(this.$inputChecked.indexOf(this.$inputAll) !== -1 ) {
        if( this.$inputAll.checked === true ) {
          // Loai bo checked trong tat cat $input khac
          for( let key in this.$inputs ) {
            this.$inputs[key].checked = false;
          }
          // Copy tat ca doi tuong $targets 
          for( let key in this.$targets ) {
            this.$targetChecked.push(this.$targets[key]);
          }
        }
      }

      /**
       * TRUONG HOP $INPUTS KHAC CHECKED
       */
      else {
        // Loai bo checked cua $inputAll
        this.$inputAll.checked = false;

        // Lay tat ca doi tuong $targets theo category $input
        for( let key in this.$inputChecked ) {
          let categoryCur = this.$inputChecked[key].value || false;
          this.GetTargetChecked(categoryCur);
        }
      }

      // Show $target
      this.ShowTarget();
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


      // Add order into TargetChecked: Addclass 'First' & 'Last' to $nodes
      let classHide: string = 'filterjs-hide';
      let classShow: string = 'filterjs-show';
      let classFirst: string = 'filterjs-first';
      let classLast: string = 'filterjs-last';
      this.RemoveClass(this.$targets, `${classHide} ${classShow} ${classFirst} ${classLast}`);
      this.AddClass($targetHide, classHide);
      this.AddClass(this.$targetChecked, classShow);

      let $checkedOrder = this.$filter.querySelectorAll(`.${ classShow }`);
      this.AddClass($checkedOrder[0], classFirst);
      this.AddClass($checkedOrder[$checkedOrder.length - 1], classLast);
    }
  }

  // Initial Filter
  document.addEventListener('DOMContentLoaded', function() {
    new FilterJS('.filterjs');
  });
})();
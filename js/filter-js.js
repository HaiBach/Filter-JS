/**
 * FILTER PURN JAVASCRIPT PLUGIN
 * @browserSupport: IE9+
 */
'use strict';
(function () {
    /**
     * CLASS FILTER JS
     */
    var FilterJS = /** @class */ (function () {
        function FilterJS(selector) {
            var $filters = document.querySelectorAll(selector);
            for (var i = 0, len = $filters.length; i < len; i++) {
                new FilterJSOne($filters[i]);
            }
        }
        return FilterJS;
    }());
    // Assign Class to Global variable
    window.FilterJS = FilterJS;
    /**
     * CLASS FILTER JS ONE
     * Ho tro nhieu filter tren cung 1 trang
     */
    var FilterJSOne = /** @class */ (function () {
        function FilterJSOne($filter) {
            // Variable Initial
            this.$filter = $filter;
            var selectorInputAll = $filter.getAttribute('data-input-all') || false;
            var selectorInput = $filter.getAttribute('data-input') || false;
            var selectorTarget = $filter.getAttribute('data-target') || false;
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
        FilterJSOne.prototype.ConvertNode = function ($nodes) {
            var $nodesNew = [];
            for (var i = 0, len = $nodes.length; i < len; i++) {
                $nodesNew.push($nodes[i]);
            }
            return $nodesNew;
        };
        FilterJSOne.prototype.ConvertPercent = function (str, $nodeSize) {
            var re = /\d+\.?\d*\%/g, match = str.match(re), vConvert, valueCur;
            for (var key in match) {
                vConvert = parseFloat(match[key].replace('%', ''), 10);
                vConvert = $nodeSize.offsetWidth * vConvert / 100;
                str = str.replace(match[key], vConvert);
            }
            return eval(str);
        };
        FilterJSOne.prototype.Find = function ($nodes, selector) {
            var $nodesNew = [];
            for (var i = 0, len = $nodes.length; i < len; i++) {
                var $nodesQuery = $nodes[i].querySelectorAll(selector);
                for (var j = 0, lenJ = $nodesQuery.length; j < lenJ; j++) {
                    $nodesNew.push($nodesQuery[j]);
                }
            }
            return $nodesNew.length ? $nodesNew : null;
        };
        FilterJSOne.prototype.Not = function ($nodes, $nodesRemove) {
            // Chuyen doi single $node sang array $node
            if ($nodesRemove.nodeType === 1)
                $nodesRemove = [$nodesRemove];
            // Copy $node to other array[]
            var $nodes1 = [];
            for (var key in $nodes) {
                $nodes1.push($nodes[key]);
            }
            // Vong lap: setup tung $nodeRemove
            for (var key in $nodesRemove) {
                var index = $nodes.indexOf($nodesRemove[key]);
                if (index !== -1) {
                    $nodes1.splice(index, 1);
                }
            }
            return $nodes1;
        };
        FilterJSOne.prototype.HasClass = function ($nodes, strClass) {
            // Chi thuc hien voi Node dau tien
            if (!!$nodes.length)
                $nodes = $nodes[0];
            // Bien
            var aClassOnNode = ($nodes.getAttribute('class') || '').split(' ');
            var isHas = false;
            for (var key in aClassOnNode) {
                if (aClassOnNode[key] === strClass) {
                    isHas = true;
                }
            }
            return isHas;
        };
        FilterJSOne.prototype.AddClass = function ($nodes, strClass) {
            var arrClass = strClass.split(' ');
            // Dieu kien thuc hien tiep
            if ($nodes === undefined)
                return;
            // Convert one node to array
            if (!!$nodes.nodeType)
                $nodes = [$nodes];
            // Loop to get all node in array
            for (var i = 0, len = $nodes.length; i < len; i++) {
                var $nodeCur = $nodes[i];
                var classOnNode = $nodeCur.getAttribute('class') || '';
                var aClassOnNode = classOnNode.split(' ');
                var isAddClass = false;
                for (var key in arrClass) {
                    if (aClassOnNode.indexOf(arrClass[key]) === -1) {
                        classOnNode += ' ' + arrClass[key];
                        isAddClass = true;
                    }
                }
                // Add class on Node
                if (isAddClass) {
                    classOnNode = classOnNode.replace(/(^\s+)|(\s+$)/g, '').replace(/\s\s+/g, ' ');
                    $nodeCur.setAttribute('class', classOnNode);
                }
            }
        };
        FilterJSOne.prototype.RemoveClass = function ($nodes, strClass) {
            var arrClass = strClass.split(' ');
            // Dieu kien thuc hien tiep
            if ($nodes === undefined)
                return;
            // Convert one node to array
            if (!!$nodes.nodeType)
                $nodes = [$nodes];
            // Loop to get all node in array
            for (var i = 0, len = $nodes.length; i < len; i++) {
                var $nodeCur = $nodes[i];
                var classOnNode = $nodeCur.getAttribute('class') || '';
                var aClassOnNode = classOnNode.split(' ');
                var isRemoveClass = false;
                // Support remove multi class
                for (var key in arrClass) {
                    for (var keyA in aClassOnNode) {
                        if (aClassOnNode[keyA] === arrClass[key]) {
                            aClassOnNode.splice(keyA, 1);
                            isRemoveClass = true;
                        }
                    }
                }
                // Remove class from Node
                if (isRemoveClass) {
                    // Remove whitespce
                    classOnNode = aClassOnNode.join(' ');
                    classOnNode = classOnNode.replace(/(^\s+)|(\s+$)/g, '').replace(/\s\s+/g, ' ');
                    classOnNode === '' ? $nodeCur.removeAttribute('class')
                        : $nodeCur.setAttribute('class', classOnNode);
                }
            }
        };
        FilterJSOne.prototype.CSS = function ($nodes, styles) {
            // Convert to Array
            if (!!$nodes.nodeType)
                $nodes = [$nodes];
            // Loop to get all Element in Array
            for (var i = 0, len = $nodes.length; i < len; i++) {
                var $nodeCur = $nodes[i];
                for (var key in styles) {
                    $nodeCur.style[key] = styles[key];
                }
            }
        };
        FilterJSOne.prototype.EventChange = function () {
            var that = this;
            // Setup EventChagne on each $input
            for (var key in this.$inputs) {
                this.$inputs[key].addEventListener('change', function () {
                    var $checked = that.InputChecked();
                    // Reset $targetChecked
                    that.$targetChecked = [];
                    // Remove checked on $inputAll
                    if (this.checked === true)
                        that.$inputAll.checked = false;
                    // Get $target has category checked in each $inputChecked
                    for (var key_1 in $checked) {
                        var categoryCur = $checked[key_1].value || false;
                        that.TargetChecked(categoryCur);
                    }
                    // console.log(that.$targetChecked);
                    // Show $target
                    that.ShowTarget();
                });
            }
            // Setup EventChange on $inputAll
            this.$inputAll.addEventListener('change', function () {
                that.CheckedAll();
            });
        };
        FilterJSOne.prototype.InputChecked = function () {
            this.$inputChecked = [];
            for (var key in this.$inputs) {
                // Push $input checked into Array[]
                if (this.$inputs[key].checked === true) {
                    this.$inputChecked.push(this.$inputs[key]);
                }
            }
            // Return $input checked
            return this.$inputChecked;
        };
        // Get $target has category on $intput checked
        FilterJSOne.prototype.TargetChecked = function (category) {
            for (var key in this.$targets) {
                // Get & convert to array category on $target Item
                var $targetCur = this.$targets[key];
                var targetCat = $targetCur.getAttribute('data-category') || '';
                targetCat = targetCat.split(' ');
                // Kiem tra $target co trung category khong
                if (targetCat.indexOf(category) !== -1) {
                    // Only push $target not in array[]
                    if (this.$targetChecked.indexOf($targetCur) === -1) {
                        this.$targetChecked.push($targetCur);
                    }
                }
            }
        };
        FilterJSOne.prototype.CheckedAll = function () {
            // Reset $targetChecked
            this.$targetChecked = [];
            if (this.$inputAll.checked === true) {
                // Select all $target  
                for (var key in this.$targets) {
                    this.$targetChecked.push(this.$targets[key]);
                }
                // Remove checked in all $input
                for (var key in this.$inputs) {
                    this.$inputs[key].checked = false;
                }
            }
            // Show $target
            this.ShowTarget();
            // console.log(this.$targetChecked);
        };
        // Check All at Begin
        FilterJSOne.prototype.CheckedAllAtBegin = function () {
            if (this.$inputAll.checked === true) {
                this.CheckedAll();
            }
        };
        // Show $target after $input change
        FilterJSOne.prototype.ShowTarget = function () {
            var $targetHide = this.Not(this.$targets, this.$targetChecked);
            // Toggle $target
            for (var key in $targetHide) {
                this.CSS($targetHide[key], { display: 'none' });
            }
            for (var key in this.$targetChecked) {
                this.CSS(this.$targetChecked, { display: '' });
            }
        };
        return FilterJSOne;
    }());
})();
// Initial Filter
document.addEventListener('DOMContentLoaded', function () {
    var filters = new FilterJS('.filterjs');
});
//# sourceMappingURL=filter-js.js.map
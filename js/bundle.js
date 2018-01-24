(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            this.$inputChecked = [];
            this.$inputCheckedInit = [];
            this.$targetChecked = [];
            // Variable Initial
            this.$filter = $filter;
            var selectorInputAll = $filter.getAttribute('data-input-all') || false;
            var selectorInput = $filter.getAttribute('data-input') || false;
            var selectorTarget = $filter.getAttribute('data-target') || false;
            this.$inputAll = $filter.querySelector(selectorInputAll) || document.createElement('div');
            this.$inputs = this.ConvertNode($filter.querySelectorAll(selectorInput));
            this.$targets = this.ConvertNode($filter.querySelectorAll(selectorTarget));
            // this.$targetChecked = [];
            // Remove $inputAll out $input
            this.$inputs = this.Not(this.$inputs, this.$inputAll);
            // Luu tru $inputChecked luc ban dau
            this.GetInputCheckedInit();
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
            var re = /\d+\.?\d*\%/g;
            var match = str.match(re);
            var vConvert, valueCur;
            for (var key in match) {
                vConvert = parseFloat(match[key].replace('%', ''));
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
            var $result = [];
            // Vong lap: setup tung $nodeRemove
            for (var key in $nodes) {
                if ($nodesRemove.indexOf($nodes[key]) === -1) {
                    $result.push($nodes[key]);
                }
            }
            return $result;
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
                    var $inputChecked = that.GetInputChecked();
                    // Reset $targetChecked
                    that.$targetChecked = [];
                    // Remove checked on $inputAll
                    if (this.checked === true)
                        that.$inputAll.checked = false;
                    // Get $target has category checked in each $inputChecked
                    for (var key_1 in $inputChecked) {
                        var categoryCur = $inputChecked[key_1].value || false;
                        that.GetTargetChecked(categoryCur);
                    }
                    // Show $target
                    that.ShowTarget();
                });
            }
            // Setup EventChange on $inputAll
            this.$inputAll.addEventListener('change', function () {
                that.SetCheckedAll();
            });
        };
        FilterJSOne.prototype.GetInputCheckedInit = function () {
            var $inputChecked = [];
            // Truong hop: InputAll checked
            if (this.$inputAll.checked === true) {
                $inputChecked.push(this.$inputAll);
            }
            else {
                for (var key in this.$inputs) {
                    if (this.$inputs[key].checked === true) {
                        $inputChecked.push(this.$inputs[key]);
                    }
                }
            }
            // Luu tru tren bien chung
            this.$inputCheckedInit = $inputChecked;
            console.log($inputChecked);
        };
        FilterJSOne.prototype.GetInputChecked = function () {
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
        FilterJSOne.prototype.GetTargetChecked = function (category) {
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
        FilterJSOne.prototype.SetCheckedAll = function () {
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
        };
        // Check All at Begin
        FilterJSOne.prototype.CheckedAllAtBegin = function () {
            if (this.$inputAll.checked === true) {
                this.SetCheckedAll();
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
            // Add order into TargetChecked: Addclass 'First' & 'Last' to $nodes
            var classHide = 'filterjs-hide';
            var classShow = 'filterjs-show';
            var classFirst = 'filterjs-first';
            var classLast = 'filterjs-last';
            this.RemoveClass(this.$targets, classHide + " " + classShow + " " + classFirst + " " + classLast);
            this.AddClass($targetHide, classHide);
            this.AddClass(this.$targetChecked, classShow);
            var $checkedOrder = this.$filter.querySelectorAll("." + classShow);
            this.AddClass($checkedOrder[0], classFirst);
            this.AddClass($checkedOrder[$checkedOrder.length - 1], classLast);
        };
        return FilterJSOne;
    }());
    // Initial Filter
    document.addEventListener('DOMContentLoaded', function () {
        new FilterJS('.filterjs');
    });
})();

},{}]},{},[1]);

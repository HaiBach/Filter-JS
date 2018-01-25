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
            this.maxShow = 20;
            this.more = 4;
            this.isMore = false;
            this.isCSSInline = true;
            this.classHide = 'filterjs-hide';
            this.classShow = 'filterjs-show';
            this.classActived = 'filterjs-actived';
            this.classFirst = 'filterjs-first';
            this.classLast = 'filterjs-last';
            // Variable Initial
            this.$filter = $filter;
            var selectorInputAll = $filter.getAttribute('data-input-all') || false;
            var selectorInput = $filter.getAttribute('data-input') || false;
            var selectorTarget = $filter.getAttribute('data-target') || false;
            var selectorReset = $filter.getAttribute('data-reset') || false;
            var selectorMore = $filter.getAttribute('data-more') || false;
            this.$inputAll = document.querySelector(selectorInputAll) || document.createElement('div');
            this.$inputs = this.ConvertNode(document.querySelectorAll(selectorInput));
            this.$targets = this.ConvertNode(document.querySelectorAll(selectorTarget));
            this.$reset = document.querySelector(selectorReset) || document.createElement('div');
            this.$more = document.querySelector(selectorMore) || false;
            this.maxShow = parseInt($filter.getAttribute('data-target-max-show')) || this.maxShow;
            this.more = parseInt($filter.getAttribute('data-target-more')) || this.more;
            this.isMore = !!this.$more;
            this.isCSSInline = $filter.getAttribute('data-is-css-inline') || this.isCSSInline;
            this.isCSSInline = (this.isCSSInline === 'false') ? false : true;
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
        // Event Change tren $inputs
        FilterJSOne.prototype.EventChange = function () {
            var that = this;
            // Setup EventChagne on each $input
            for (var key in this.$inputs) {
                this.$inputs[key].addEventListener('change', function () {
                    // Remove checked on $inputAll
                    if (this.checked === true)
                        that.$inputAll.checked = false;
                    // Lay doi tuong $inputs checked
                    that.$inputChecked = that.GetInputChecked();
                    // Hien thi cac doi tuong $target checked
                    that.SetTargetChecked();
                });
            }
            // Setup EventChange on $inputAll
            this.$inputAll.addEventListener('change', function () {
                // Lay doi tuong $inputAll
                that.$inputChecked = [that.$inputAll];
                // Hien thi cac doi tuong $target checked
                that.SetTargetChecked();
            });
        };
        // Event Tap tren button Reset
        FilterJSOne.prototype.EventTap = function () {
            var that = this;
            /**
             * EVENT TAP TREN BUTTON $RESET
             */
            this.$reset.addEventListener('click', function (e) {
                // Loai bo checked tren cac $inputs khong co checked luc dau
                var $inputNotChecked = that.Not(that.$inputs, that.$inputCheckedInit);
                for (var key in $inputNotChecked) {
                    $inputNotChecked[key].checked = false;
                }
                // Set checked tren luu tru luc ban dau
                for (var key in that.$inputCheckedInit) {
                    that.$inputCheckedInit[key].checked = true;
                }
                // Lay doi tuong $input checked
                that.$inputChecked = that.$inputCheckedInit;
                // Hien thi cac doi tuong $target checked
                that.SetTargetChecked();
                // Don't add URL with href="#" - Stop Hash(#)
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            });
            /**
             * EVENT TAP TREN BUTTON MORE
             */
            this.isMore && this.$more.addEventListener('click', function (e) {
                var $targetShow = [];
                // Them doi tuong $target vao mang[]
                for (var i = 0, len = that.$targetActived.length; i < len; i++) {
                    if (i < that.more) {
                        $targetShow.push(that.$targetActived[i]);
                    }
                }
                // Loai bo $targetShow khoi doi tuong $targetActived
                that.$targetActived = that.Not(that.$targetActived, $targetShow);
                /**
                 * Toggle class
                 */
                // Loai bo class 'last' tren doi tuong $targetLast
                // Loai bo class 'hide' tren cac doi tuong $target Show
                that.isCSSInline && that.CSS($targetShow, { display: '' });
                that.RemoveClass(that.$targets, that.classLast);
                that.RemoveClass($targetShow, that.classHide);
                // Add class vao doi tuong $target hien thi them
                setTimeout(function () {
                    that.AddClass($targetShow, that.classShow);
                    that.AddClass($targetShow[$targetShow.length - 1], that.classLast);
                }, 50);
                // Toggle Button More
                that.ToggleMore();
                // Don't add URL with href="#" - Stop Hash(#)
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            });
        };
        FilterJSOne.prototype.GetInputChecked = function () {
            var $inputChecked = [];
            // Truong hop: InputAll checked
            if (this.$inputAll.checked === true) {
                $inputChecked.push(this.$inputAll);
                // Loai bo checked o khac $inputs khac
                for (var key in this.$inputs) {
                    this.$inputs[key].checked = false;
                }
            }
            else {
                for (var key in this.$inputs) {
                    if (this.$inputs[key].checked === true) {
                        $inputChecked.push(this.$inputs[key]);
                    }
                }
            }
            return $inputChecked;
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
        FilterJSOne.prototype.SetTargetChecked = function () {
            // Reset $targetChecked
            this.$targetChecked = [];
            /**
             * TRUONG HOP: $INPUTALL CHECKED
             */
            if (this.$inputChecked.indexOf(this.$inputAll) !== -1) {
                if (this.$inputAll.checked === true) {
                    // Loai bo checked trong tat cat $input khac
                    for (var key in this.$inputs) {
                        this.$inputs[key].checked = false;
                    }
                    // Copy tat ca doi tuong $targets 
                    for (var key in this.$targets) {
                        this.$targetChecked.push(this.$targets[key]);
                    }
                }
            }
            else {
                // Loai bo checked cua $inputAll
                this.$inputAll.checked = false;
                // Lay tat ca doi tuong $targets theo category $input
                for (var key in this.$inputChecked) {
                    var categoryCur = this.$inputChecked[key].value || false;
                    this.GetTargetChecked(categoryCur);
                }
            }
            // Show $target
            this.ShowTarget();
        };
        // Show $target after $input change
        FilterJSOne.prototype.ShowTarget = function () {
            var that = this;
            // Reset tat ca cac $target: loai bo tat ca cac class
            this.RemoveClass(this.$targets, this.classHide + " " + this.classShow + " " + this.classActived + " " + this.classFirst + " " + this.classLast);
            // Them class 'actived' vao cac $targetChecked de nhan biet theo thu tu
            this.AddClass(this.$targetChecked, this.classActived);
            // Lay doi tuong $target actived theo thu tu
            this.$targetActived = this.ConvertNode(this.$filter.querySelectorAll("." + this.classActived));
            // Lay doi tuong $target duoc phep show
            var $targetShow = [];
            if (this.isMore) {
                // Hien thi doi tuong $target voi so luong MaxShow
                for (var i = 0, len = this.$targetActived.length; i < len; i++) {
                    if (i < this.maxShow) {
                        // Them doi tuong vao mang $target Show
                        $targetShow.push(this.$targetActived[i]);
                    }
                }
                // Loai bo doi tuong $targetShow trong $targetActived
                this.$targetActived = this.Not(this.$targetActived, $targetShow);
            }
            else {
                $targetShow = this.$targetActived;
            }
            // Lay cac doi tuong $target hide
            var $targetHide = this.Not(this.$targets, $targetShow);
            /**
             * Add class tren cac loai $target
             */
            this.isCSSInline && this.CSS($targetHide, { display: 'none' });
            this.isCSSInline && this.CSS($targetShow, { display: '' });
            this.AddClass($targetHide, this.classHide);
            this.AddClass($targetShow, this.classShow);
            this.AddClass($targetShow[0], this.classFirst);
            this.AddClass($targetShow[$targetShow.length - 1], this.classLast);
            // Toggle class hien thi Button More
            this.ToggleMore();
        };
        // Toggle class hien thi Button More
        FilterJSOne.prototype.ToggleMore = function () {
            if (this.isMore) {
                if (this.$targetActived.length > 0) {
                    this.AddClass(this.$more, this.classShow);
                }
                else {
                    this.RemoveClass(this.$more, this.classShow);
                }
            }
        };
        return FilterJSOne;
    }());
    // Initial Filter
    document.addEventListener('DOMContentLoaded', function () {
        new FilterJS('.filterjs');
    });
})();
//# sourceMappingURL=filter-js.js.map
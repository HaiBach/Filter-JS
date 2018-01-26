'use strict';
(function () {
    var FilterJS =  (function () {
        function FilterJS(selector) {
            var $filters = document.querySelectorAll(selector);
            for (var i = 0, len = $filters.length; i < len; i++) {
                new FilterJSOne($filters[i]);
            }
        }
        return FilterJS;
    }());
    window.FilterJS = FilterJS;
    var FilterJSOne =  (function () {
        function FilterJSOne($filter) {
            this.$inputChecked = [];
            this.$inputCheckedInit = [];
            this.$targetChecked = [];
            this.maxShow = 20;
            this.more = 4;
            this.isMore = false;
            this.classHide = 'filterjs-hide';
            this.classShow = 'filterjs-show';
            this.classActived = 'filterjs-actived';
            this.classFirst = 'filterjs-first';
            this.classLast = 'filterjs-last';
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
            this.isAllowNoChecked = ($filter.getAttribute('data-is-allow-no-check') === 'true') ? true : false;
            this.$inputs = this.Not(this.$inputs, this.$inputAll);
            this.$inputCheckedInit = this.$inputChecked = this.GetInputChecked();
            this.SetTargetChecked();
            this.EventChange();
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
            if ($nodesRemove.nodeType === 1)
                $nodesRemove = [$nodesRemove];
            var $result = [];
            for (var key in $nodes) {
                if ($nodesRemove.indexOf($nodes[key]) === -1) {
                    $result.push($nodes[key]);
                }
            }
            return $result;
        };
        FilterJSOne.prototype.HasClass = function ($nodes, strClass) {
            if (!!$nodes.length)
                $nodes = $nodes[0];
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
            if ($nodes === undefined)
                return;
            if (!!$nodes.nodeType)
                $nodes = [$nodes];
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
                if (isAddClass) {
                    classOnNode = classOnNode.replace(/(^\s+)|(\s+$)/g, '').replace(/\s\s+/g, ' ');
                    $nodeCur.setAttribute('class', classOnNode);
                }
            }
        };
        FilterJSOne.prototype.RemoveClass = function ($nodes, strClass) {
            var arrClass = strClass.split(' ');
            if ($nodes === undefined)
                return;
            if (!!$nodes.nodeType)
                $nodes = [$nodes];
            for (var i = 0, len = $nodes.length; i < len; i++) {
                var $nodeCur = $nodes[i];
                var classOnNode = $nodeCur.getAttribute('class') || '';
                var aClassOnNode = classOnNode.split(' ');
                var isRemoveClass = false;
                for (var key in arrClass) {
                    for (var keyA in aClassOnNode) {
                        if (aClassOnNode[keyA] === arrClass[key]) {
                            aClassOnNode.splice(keyA, 1);
                            isRemoveClass = true;
                        }
                    }
                }
                if (isRemoveClass) {
                    classOnNode = aClassOnNode.join(' ');
                    classOnNode = classOnNode.replace(/(^\s+)|(\s+$)/g, '').replace(/\s\s+/g, ' ');
                    classOnNode === '' ? $nodeCur.removeAttribute('class')
                        : $nodeCur.setAttribute('class', classOnNode);
                }
            }
        };
        FilterJSOne.prototype.CSS = function ($nodes, styles) {
            if (!!$nodes.nodeType)
                $nodes = [$nodes];
            for (var i = 0, len = $nodes.length; i < len; i++) {
                var $nodeCur = $nodes[i];
                for (var key in styles) {
                    $nodeCur.style[key] = styles[key];
                }
            }
        };
        FilterJSOne.prototype.EventChange = function () {
            var that = this;
            for (var key in this.$inputs) {
                this.$inputs[key].addEventListener('change', function () {
                    if (this.checked === true) {
                        that.$inputAll.checked = false;
                    }
                    else {
                        if (!that.isAllowNoChecked) {
                            var isChecked = false;
                            for (var key_1 in that.$inputs) {
                                if (that.$inputs[key_1].checked === true)
                                    isChecked = true;
                            }
                            if (!isChecked)
                                that.$inputAll.checked = true;
                        }
                    }
                    that.$inputChecked = that.GetInputChecked();
                    that.SetTargetChecked();
                });
            }
            this.$inputAll.addEventListener('change', function () {
                if (this.checked === false) {
                    if (!that.isAllowNoChecked)
                        this.checked = true;
                }
                that.$inputChecked = that.GetInputChecked();
                that.SetTargetChecked();
            });
        };
        FilterJSOne.prototype.EventTap = function () {
            var that = this;
            this.$reset.addEventListener('click', function (e) {
                var $inputNotChecked = that.Not(that.$inputs, that.$inputCheckedInit);
                for (var key in $inputNotChecked) {
                    $inputNotChecked[key].checked = false;
                }
                for (var key in that.$inputCheckedInit) {
                    that.$inputCheckedInit[key].checked = true;
                }
                that.$inputChecked = that.$inputCheckedInit;
                that.SetTargetChecked();
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            });
            this.isMore && this.$more.addEventListener('click', function (e) {
                var $targetShow = [];
                for (var i = 0, len = that.$targetActived.length; i < len; i++) {
                    if (i < that.more) {
                        $targetShow.push(that.$targetActived[i]);
                    }
                }
                that.$targetActived = that.Not(that.$targetActived, $targetShow);
                that.CSS($targetShow, { display: '' });
                that.RemoveClass(that.$targets, that.classLast);
                that.RemoveClass($targetShow, that.classHide);
                setTimeout(function () {
                    that.AddClass($targetShow, that.classShow);
                    that.AddClass($targetShow[$targetShow.length - 1], that.classLast);
                }, 50);
                that.ToggleMore();
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            });
        };
        FilterJSOne.prototype.GetInputChecked = function () {
            var $inputChecked = [];
            if (this.$inputAll.checked === true) {
                $inputChecked.push(this.$inputAll);
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
        FilterJSOne.prototype.GetTargetChecked = function (category) {
            for (var key in this.$targets) {
                var $targetCur = this.$targets[key];
                var targetCat = $targetCur.getAttribute('data-category') || '';
                targetCat = targetCat.split(' ');
                if (targetCat.indexOf(category) !== -1) {
                    if (this.$targetChecked.indexOf($targetCur) === -1) {
                        this.$targetChecked.push($targetCur);
                    }
                }
            }
        };
        FilterJSOne.prototype.SetTargetChecked = function () {
            this.$targetChecked = [];
            if (this.$inputChecked.indexOf(this.$inputAll) !== -1) {
                if (this.$inputAll.checked === true) {
                    for (var key in this.$inputs) {
                        this.$inputs[key].checked = false;
                    }
                    for (var key in this.$targets) {
                        this.$targetChecked.push(this.$targets[key]);
                    }
                }
            }
            else {
                this.$inputAll.checked = false;
                for (var key in this.$inputChecked) {
                    var categoryCur = this.$inputChecked[key].value || false;
                    this.GetTargetChecked(categoryCur);
                }
            }
            this.ShowTarget();
        };
        FilterJSOne.prototype.ShowTarget = function () {
            var that = this;
            this.RemoveClass(this.$targets, this.classHide + " " + this.classShow + " " + this.classActived + " " + this.classFirst + " " + this.classLast);
            this.AddClass(this.$targetChecked, this.classActived);
            this.$targetActived = this.ConvertNode(this.$filter.querySelectorAll("." + this.classActived));
            var $targetShow = [];
            if (this.isMore) {
                for (var i = 0, len = this.$targetActived.length; i < len; i++) {
                    if (i < this.maxShow) {
                        $targetShow.push(this.$targetActived[i]);
                    }
                }
                this.$targetActived = this.Not(this.$targetActived, $targetShow);
            }
            else {
                $targetShow = this.$targetActived;
            }
            var $targetHide = this.Not(this.$targets, $targetShow);
            this.CSS($targetHide, { display: 'none' });
            this.CSS($targetShow, { display: '' });
            this.AddClass($targetHide, this.classHide);
            this.AddClass($targetShow, this.classShow);
            this.AddClass($targetShow[0], this.classFirst);
            this.AddClass($targetShow[$targetShow.length - 1], this.classLast);
            this.ToggleMore();
        };
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
    document.addEventListener('DOMContentLoaded', function () {
        new FilterJS('.filterjs');
    });
})();

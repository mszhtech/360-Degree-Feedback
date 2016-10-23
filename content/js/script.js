//问卷

$(function () {
    //添加题目折叠
    $(".addTMType").each(function () {
        var $this = $(this),
            $btn = $this.find(".name"),
            $hide = $this.find(".type");
        $btn.click(function () {
            if ($hide.is(":hidden")) {
                $hide.show(0);
            } else {
                $hide.hide(0);
            }
        });
    });

    //生成全球唯一字符串
    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    //点击添加题目
    $(".addTMType .type a").each(function () {
        var $this = $(this),
            type = $this.attr('href');//获取添加题目类型

        $this.bind('click', function () {

            var $quesClone = $(".questionsType ." + type).clone();//复制一个题目结构给$quesClone
            var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;//获取已添加题目的数目给hasQuesNum

            var $szxxTableTr = $quesClone.find(".szxx tbody tr");//添加的题目设置选项的列表

            $(".n_dsb_wjgl .list .quesOne tbody").hide();

            $quesClone.find('td.num').text(hasQuesNum + 1);//设置新添加题目的题号

            var questionId = guidGenerator();//题目ID
            var sequence = hasQuesNum + 1;//题目序号
            var tmbt = $quesClone.find(".tm").html();//题目标题
            var tmsm = $quesClone.find(".tmsm").val();//题目说明
            var mrnr = $quesClone.find(".mrnr").val();//默认内容
            var tmwd = $quesClone.find(".tmwd").attr("fcvalue");//题目维度

            $quesClone.find('td').attr("sequence", sequence);//题目序号--
            $quesClone.find('td').attr("quesid", questionId);//题目ID--
            $quesClone.find('td').attr("questiontype", type);//题目类型--

            $quesClone.find('.questiondetail').attr("name", "QUES_" + questionId);//题目name--
            $quesClone.find('.questiondetail').attr("id", "QUES_" + questionId);//题目ID--
            var inputval = { 'id': questionId, 'tmbt': tmbt, 'sequence': sequence, 'questype': type, 'tmsm': tmsm, 'mrnr': mrnr, 'tmwd': tmwd };
            $quesClone.find('.questiondetail').val(JSON.stringify(inputval));//(questionId + "$" + tmbt + "$" + sequence + "$" + type + "$" + tmsm + "$" + mrnr + "$" + tmwd);//题目ID--

            //单选题时重置题目选项
            if (type == "dxQues") {
                var $o = $quesClone.find(".szxx");
                resetoption($o);
            }

            $quesClone.appendTo($(".n_dsb_wjgl .list"));//插入添加题目

            //插入后按钮状态及序号
            sortQues();

            //题目移动按钮
            var $endT = $quesClone.find(".endT");
            var $endB = $quesClone.find(".endB");
            var $top = $quesClone.find(".top");
            var $bottom = $quesClone.find(".bottom");
            var $delBtn = $quesClone.find(".delBtn");
            var $editBtn = $quesClone.find(".editBtn");
            var $copyBtn = $quesClone.find(".copyBtn");

            var $tmedit = $quesClone.find(".tmedit");//题目标题
            var $tmsmedit = $quesClone.find(".tmsm");//题目说明
            var $optionedit = $quesClone.find(".optionchange");//选项内容
            var $mrnr = $quesClone.find(".mrnr");//默认内容
            var $tmwd = $quesClone.find(".tmwd");//题目维度

            //alert(hasQuesNum);
            //题目上移
            $top.bind('click', function () {
                var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                var $thisQues = $top.parent().parent().parent().parent().parent();
                var $parent = $thisQues.parent();
                var $prevQues = $thisQues.prev();
                var $nextQues = $thisQues.next();
                var index = $thisQues.index();

                if (index > 0) {
                    //alert('上移');
                    $thisQues.insertBefore($prevQues);
                    sortQues();
                    resetallquestiondetail();
                } else {
                    //alert('top'); 
                }
                return false;
            });

            //题目下移
            $bottom.bind('click', function () {

                var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                var $thisQues = $top.parent().parent().parent().parent().parent();
                var $parent = $thisQues.parent();
                var $prevQues = $thisQues.prev();
                var $nextQues = $thisQues.next();
                var index = $thisQues.index();

                if (index < (hasQuesNum - 1)) {
                    //alert('下移');
                    $thisQues.insertAfter($nextQues);
                    sortQues();
                    resetallquestiondetail();
                } else {
                    //alert('bottom');  
                }
                return false;
            });

            //题目置顶
            $endT.bind('click', function () {

                var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                var $thisQues = $top.parent().parent().parent().parent().parent();
                var $parent = $thisQues.parent();
                var $prevQues = $thisQues.prev();
                var $nextQues = $thisQues.next();
                var index = $thisQues.index();

                if (index > 0) {
                    //alert('置顶');
                    $thisQues.prependTo($parent);
                    sortQues();
                    resetallquestiondetail();
                } else {
                    //alert('endTop');  
                }
                return false;
            });

            //题目置低
            $endB.bind('click', function () {
                var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                var $thisQues = $top.parent().parent().parent().parent().parent();
                var $parent = $thisQues.parent();
                var $prevQues = $thisQues.prev();
                var $nextQues = $thisQues.next();
                var index = $thisQues.index();

                if (index < (hasQuesNum - 1)) {
                    //alert('置低');
                    $thisQues.appendTo($parent);
                    sortQues();
                    resetallquestiondetail();
                } else {
                    //alert('endBottom');   
                }
                return false;
            });

            //题目删除
            $delBtn.bind('click', function () {
                if (confirm("是否要删除题目？")) {
                    var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                    var $thisQues = $top.parent().parent().parent().parent().parent();
                    var $parent = $thisQues.parent();
                    var $prevQues = $thisQues.prev();
                    var $nextQues = $thisQues.next();
                    var index = $thisQues.index();

                    $thisQues.remove();
                    sortQues();
                }
                return false;
            });

            //题目复制
            $copyBtn.bind('click', function () {
                copyques(this);
                return false;
            });

            //题目编辑
            $editBtn.bind('click', function () {

                var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                var $thisQues = $top.parent().parent().parent().parent().parent();
                var $parent = $thisQues.parent();
                var $prevQues = $thisQues.prev();
                var $nextQues = $thisQues.next();
                var index = $thisQues.index();

                if ($thisQues.find("tbody").is(":hidden")) {
                    $thisQues.find("tbody").show(0);
                } else {
                    $thisQues.find("tbody").hide(0);
                }
                return false;
            });

            //选项
            $szxxTableTr.each(function () {
                var $thisTr = $(this);
                var index = $thisTr.index();
                //设置选项中移动按钮
                var $xxTop = $thisTr.find(".xxTop");
                var $xxbottom = $thisTr.find(".xxBottom");

                //设置选项中 添加 删除 按钮
                var $xxAdd = $thisTr.find(".addxxBtn");
                var $xxDel = $thisTr.find(".delxxBtn");
                srotXx();

                //选项上移
                $xxTop.bind('click', function () {
                    var $thisXx = $(this).parent().parent();
                    var $parent = $thisXx.parent();
                    var $nextXx = $thisXx.next();
                    var $prevXx = $thisXx.prev();
                    var index = $thisXx.index();
                    var len = $parent.find("tr").length;

                    //选项展示位置对象
                    var $thisQues = $parent.parents(".quesOne");
                    var $xxPs = $thisQues.find("thead p.xx");

                    var $o = $(this).parents(".szxx");//重置选项
                    if (index > 0) {
                        //alert('上移');
                        $thisXx.insertBefore($prevXx);
                        $xxPs.eq(index).insertBefore($xxPs.eq(index - 1));
                        srotXx();
                        resetoption($o);
                    } else {
                        //alert('top'); 
                    }
                    return false;
                });

                //选项下移
                $xxbottom.bind('click', function () {
                    var $thisXx = $(this).parent().parent();
                    var $parent = $thisXx.parent();
                    var $nextXx = $thisXx.next();
                    var $prevXx = $thisXx.prev();
                    var index = $thisXx.index();
                    var len = $parent.find("tr").length;

                    //选项展示位置对象
                    var $thisQues = $parent.parents(".quesOne");
                    var $xxPs = $thisQues.find("thead p.xx");

                    var $o = $(this).parents(".szxx");//重置选项
                    if (index < (len - 1)) {
                        //alert('下移');
                        $thisXx.insertAfter($nextXx);
                        $xxPs.eq(index).insertAfter($xxPs.eq(index + 1));
                        srotXx();
                        resetoption($o);
                    } else {
                        //alert('bottom');  
                    }
                    return false;
                });

                //选项添加
                $xxAdd.bind('click', function () {
                    //alert("add");
                    var $xxTrClone = $quesClone.find(".szxx tbody tr").eq(0).clone(true);//复制一个选项设置结构给$xxTrClone
                    $xxTrClone.find("input:text").val("");
                    var $thisXx = $(this).parent().parent();
                    var $parent = $thisXx.parent();
                    var index = $thisXx.index();

                    //选项展示位置对象
                    var $thisQues = $parent.parents(".quesOne");
                    var $xxPs = $thisQues.find("thead p.xx");
                    var $xxPClone = $xxPs.eq(0).clone();
                    $xxPClone.find("span").text("");

                    var $o = $(this).parents(".szxx");//重置选项
                    $xxTrClone.find("td").eq(0).find("input").eq(1).val(index + 2);
                    $thisXx.after($xxTrClone);
                    $xxPs.eq(index).after($xxPClone);
                    srotXx();
                    resetoption($o);
                    return false;
                });

                //选项删除
                $xxDel.bind('click', function () {
                    //alert("del");
                    var $thisXx = $(this).parent().parent();
                    var $parent = $thisXx.parent();
                    var index = $thisXx.index();

                    //选项展示位置对象
                    var $thisQues = $parent.parents(".quesOne");
                    var $xxPs = $thisQues.find("thead p.xx");

                    var $o = $(this).parents(".szxx");
                    if ($parent.find("tr").length > 2) {
                        $thisXx.remove();
                        $xxPs.eq(index).remove();
                        srotXx();
                        resetoption($o);
                    } else {
                        alert("最少保留两个选项！");
                    }
                    return false;
                });
            });

            //题目标题动态输入--
            $tmedit.bind('keyup', function () {
                
                $(this).parents("table").find("thead .tm").html($(this).val());
                resetquestiondetail(this);
            });

            //题目说明动态变化
            $tmsmedit.bind('keyup', function () {
                resetquestiondetail(this);
            });

            //默认内容动态彼变化
            $mrnr.bind('keyup', function () {
                resetquestiondetail(this);
            });

            //选择题目维度
            $tmwd.bind('click', function () {
                alert("请选择维度");
            });

            //选项变化绑定动作
            $optionedit.bind('keyup', function () {
                var $o = $(this).parents(".szxx");
                resetoption($o);
            });

            AddInit();
            $tmedit.focus();
            return false;
        });


        //题目位置变动更改详情
        function resetallquestiondetail() {
            var allquestionarea = $(".n_dsb_wjgl .list .quesOne");//题目列表
            allquestionarea.each(function () {
                var questionarea = $(this);//题目区域
                var questionId = questionarea.find(".num").attr("quesid");//题目ID
                var sequence = questionarea.find(".num").attr("sequence");//题目序号
                var questype = questionarea.find(".num").attr("questiontype");//题目类型
                var tmbt = questionarea.find(".tm").html();//题目标题
                var tmsm = questionarea.find(".tmsm").val();//题目说明
                var mrnr = questionarea.find(".mrnr").val();//默认内容
                var tmwd = questionarea.find(".tmwd").attr("fcvalue");//题目维度

                var inputval = { 'id': questionId, 'tmbt': tmbt, 'sequence': sequence, 'questype': questype, 'tmsm': tmsm, 'mrnr': mrnr, 'tmwd': tmwd };
                questionarea.find('.questiondetail').val(JSON.stringify(inputval));//(questionId + "$" + tmbt + "$" + sequence + "$" + questype + "$" + tmsm + "$" + mrnr + "$" + tmwd);//题目详情--
            })
        }
    });

    //复制题目
    function copyques(o) {
        var $quesClone = $(o).parents(".quesOne").clone();//复制一个题目结构给$quesClone
        var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;//获取已添加题目的数目给hasQuesNum

        var $szxxTableTr = $quesClone.find(".szxx tbody tr");//添加的题目设置选项的列表
        $(".n_dsb_wjgl .list .quesOne tbody").hide();

        $quesClone.find('td.num').text(hasQuesNum + 1);//设置新添加题目的题号

        var questionId = guidGenerator();//题目ID
        var sequence = hasQuesNum + 1;//题目序号
        var questype = $quesClone.find(".num").attr("questiontype");//题目类型
        var tmbt = $quesClone.find(".tm").html();//题目标题
        var tmsm = $quesClone.find(".tmsm").val();//题目说明
        var mrnr = $quesClone.find(".mrnr").val();//默认内容
        var tmwd = $quesClone.find(".tmwd").attr("fcvalue");//题目维度

        $quesClone.find('td').attr("sequence", sequence);//题目序号--
        $quesClone.find('td').attr("quesid", questionId);//题目ID--
        $quesClone.find('td').attr("questiontype", questype);//题目类型--

        $quesClone.find('.questiondetail').attr("name", "QUES_" + questionId);//题目name--
        $quesClone.find('.questiondetail').attr("id", "QUES_" + questionId);//题目ID--
        var inputval = { 'id': questionId, 'tmbt': tmbt, 'sequence': sequence, 'questype': questype, 'tmsm': tmsm, 'mrnr': mrnr, 'tmwd': tmwd };
        $quesClone.find('.questiondetail').val(JSON.stringify(inputval));//(questionId + "$" + tmbt + "$" + sequence + "$" + type + "$" + tmsm + "$" + mrnr + "$" + tmwd);//题目ID--

        //单选题时重置题目选项
        if (questype == "dxQues") {
            var $o = $quesClone.find(".szxx");
            resetoption($o);
        }
        $quesClone.find("tbody").show();
        //$(o).parents(".quesOne").after($quesClone);//插入添加题目
        $quesClone.appendTo($(".n_dsb_wjgl .list"));//插入添加题目

        //插入后按钮状态及序号
        sortQues();

        //题目移动按钮
        var $endT = $quesClone.find(".endT");
        var $endB = $quesClone.find(".endB");
        var $top = $quesClone.find(".top");
        var $bottom = $quesClone.find(".bottom");
        var $delBtn = $quesClone.find(".delBtn");
        var $editBtn = $quesClone.find(".editBtn");
        var $copyBtn = $quesClone.find(".copyBtn");

        var $tmedit = $quesClone.find(".tmedit");//题目标题
        var $tmsmedit = $quesClone.find(".tmsm");//题目说明
        var $optionedit = $quesClone.find(".optionchange");//选项内容
        var $mrnr = $quesClone.find(".mrnr");//默认内容
        var $tmwd = $quesClone.find(".tmwd");//题目维度

        //alert(hasQuesNum);
        //题目上移
        $top.bind('click', function () {
            var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
            var $thisQues = $top.parent().parent().parent().parent().parent();
            var $parent = $thisQues.parent();
            var $prevQues = $thisQues.prev();
            var $nextQues = $thisQues.next();
            var index = $thisQues.index();

            if (index > 0) {
                //alert('上移');
                $thisQues.insertBefore($prevQues);
                sortQues();
                resetallquestiondetail();
            } else {
                //alert('top'); 
            }
            return false;
        });

        //题目下移
        $bottom.bind('click', function () {

            var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
            var $thisQues = $top.parent().parent().parent().parent().parent();
            var $parent = $thisQues.parent();
            var $prevQues = $thisQues.prev();
            var $nextQues = $thisQues.next();
            var index = $thisQues.index();

            if (index < (hasQuesNum - 1)) {
                //alert('下移');
                $thisQues.insertAfter($nextQues);
                sortQues();
                resetallquestiondetail();
            } else {
                //alert('bottom');  
            }
            return false;
        });

        //题目置顶
        $endT.bind('click', function () {

            var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
            var $thisQues = $top.parent().parent().parent().parent().parent();
            var $parent = $thisQues.parent();
            var $prevQues = $thisQues.prev();
            var $nextQues = $thisQues.next();
            var index = $thisQues.index();

            if (index > 0) {
                //alert('置顶');
                $thisQues.prependTo($parent);
                sortQues();
                resetallquestiondetail();
            } else {
                //alert('endTop');  
            }
            return false;
        });

        //题目置低
        $endB.bind('click', function () {

            var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
            var $thisQues = $top.parent().parent().parent().parent().parent();
            var $parent = $thisQues.parent();
            var $prevQues = $thisQues.prev();
            var $nextQues = $thisQues.next();
            var index = $thisQues.index();

            if (index < (hasQuesNum - 1)) {
                //alert('置低');
                $thisQues.appendTo($parent);
                sortQues();
                resetallquestiondetail();
            } else {
                //alert('endBottom');   
            }
            return false;
        });

        //题目删除
        $delBtn.bind('click', function () {
            if (confirm("是否要删除题目？")) {
                var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
                var $thisQues = $top.parent().parent().parent().parent().parent();
                var $parent = $thisQues.parent();
                var $prevQues = $thisQues.prev();
                var $nextQues = $thisQues.next();
                var index = $thisQues.index();

                $thisQues.remove();
                sortQues();
            }
            return false;
        });

        //题目复制
        $copyBtn.bind('click', function () {
            copyques(this);
            return false;
        });

        //题目编辑
        $editBtn.bind('click', function () {

            var hasQuesNum = $(".n_dsb_wjgl .list .quesOne").length;
            var $thisQues = $top.parent().parent().parent().parent().parent();
            var $parent = $thisQues.parent();
            var $prevQues = $thisQues.prev();
            var $nextQues = $thisQues.next();
            var index = $thisQues.index();

            if ($thisQues.find("tbody").is(":hidden")) {
                $thisQues.find("tbody").show(0);
            } else {
                $thisQues.find("tbody").hide(0);
            }
            return false;
        });

        //选项
        $szxxTableTr.each(function () {
            var $thisTr = $(this);
            var index = $thisTr.index();
            //设置选项中移动按钮
            var $xxTop = $thisTr.find(".xxTop");
            var $xxbottom = $thisTr.find(".xxBottom");

            //设置选项中 添加 删除 按钮
            var $xxAdd = $thisTr.find(".addxxBtn");
            var $xxDel = $thisTr.find(".delxxBtn");
            srotXx();


            //选项上移
            $xxTop.bind('click', function () {
                var $thisXx = $(this).parent().parent();
                var $parent = $thisXx.parent();
                var $nextXx = $thisXx.next();
                var $prevXx = $thisXx.prev();
                var index = $thisXx.index();
                var len = $parent.find("tr").length;

                //选项展示位置对象
                var $thisQues = $parent.parents(".quesOne");
                var $xxPs = $thisQues.find("thead p.xx");

                var $o = $(this).parents(".szxx");//重置选项
                if (index > 0) {
                    //alert('上移');
                    $thisXx.insertBefore($prevXx);
                    $xxPs.eq(index).insertBefore($xxPs.eq(index - 1));
                    srotXx();
                    resetoption($o);
                } else {
                    //alert('top'); 
                }
                return false;
            });

            //选项下移
            $xxbottom.bind('click', function () {
                var $thisXx = $(this).parent().parent();
                var $parent = $thisXx.parent();
                var $nextXx = $thisXx.next();
                var $prevXx = $thisXx.prev();
                var index = $thisXx.index();
                var len = $parent.find("tr").length;

                //选项展示位置对象
                var $thisQues = $parent.parents(".quesOne");
                var $xxPs = $thisQues.find("thead p.xx");

                var $o = $(this).parents(".szxx");//重置选项
                if (index < (len - 1)) {
                    //alert('下移');
                    $thisXx.insertAfter($nextXx);
                    $xxPs.eq(index).insertAfter($xxPs.eq(index + 1));
                    srotXx();
                    resetoption($o);
                } else {
                    //alert('bottom');  
                }
                return false;
            });

            //选项添加
            $xxAdd.bind('click', function () {
                //alert("add");
                var $xxTrClone = $quesClone.find(".szxx tbody tr").eq(0).clone(true);//复制一个选项设置结构给$xxTrClone
                $xxTrClone.find("input:text").val("");
                var $thisXx = $(this).parent().parent();
                var $parent = $thisXx.parent();
                var index = $thisXx.index();

                //选项展示位置对象
                var $thisQues = $parent.parents(".quesOne");
                var $xxPs = $thisQues.find("thead p.xx");
                var $xxPClone = $xxPs.eq(0).clone();
                $xxPClone.find("span").text("");

                var $o = $(this).parents(".szxx");//重置选项
                $xxTrClone.find("td").eq(0).find("input").eq(1).val(index + 2);
                $thisXx.after($xxTrClone);
                $xxPs.eq(index).after($xxPClone);
                srotXx();
                resetoption($o);
                return false;
            });

            //选项删除
            $xxDel.bind('click', function () {
                //alert("del");
                var $thisXx = $(this).parent().parent();
                var $parent = $thisXx.parent();
                var index = $thisXx.index();

                //选项展示位置对象
                var $thisQues = $parent.parents(".quesOne");
                var $xxPs = $thisQues.find("thead p.xx");

                var $o = $(this).parents(".szxx");
                if ($parent.find("tr").length > 2) {
                    $thisXx.remove();
                    $xxPs.eq(index).remove();
                    srotXx();
                    resetoption($o);
                } else {
                    alert("最少保留两个选项！");
                }
                return false;
            });
        });

        //题目标题动态输入--
        $tmedit.bind('keyup', function () {
            
            $(this).parents("table").find("thead .tm").html($(this).val());
            resetquestiondetail(this);
        });

        //题目说明动态变化
        $tmsmedit.bind('keyup', function () {
            resetquestiondetail(this);
        });

        //默认内容动态彼变化
        $mrnr.bind('keyup', function () {
            resetquestiondetail(this);
        });

        //选择题目维度
        $tmwd.bind('click', function () {
            tb_show("选择题目维度", "/Solution/Paper/List?questionId=" + questionId, 800, 600);
        });

        //选项变化绑定动作
        $optionedit.bind('keyup', function () {
            var $o = $(this).parents(".szxx");
            resetoption($o);
        });
        AddInit();
       
        $tmedit.focus();
        return false;
    }

    //选项变动后重新初始化选项
    function resetoption(o) {
        var $optionList = $(o).find("tr");
        var $optionshow = $(o).parents(".quesOne").find(".tmzs");
        var optionhtml = '';
        var optiondesc = '', optionscore = 0, questionid = $(o).parents(".quesOne").find(".num").attr("quesid"), optionseq = 0;
        for (var i = 0; i < $optionList.length; i++) {

            optiondesc = $($optionList[i]).find("td").eq(0).find("input").eq(0).val();//选项描述
            optionscore = $($optionList[i]).find("td").eq(0).find("input").eq(1).val();//选项分值
            optionseq = i + 1;//选项序号

            optionhtml += '<p class="xx clearFix">';
            optionhtml += '<input type="radio" optiondesc="' + optiondesc + '" optionscore="' + optionscore + '" class="radio" />';
            optionhtml += '<span>' + optiondesc + '</span>';
            optionhtml += '<input type="hidden" name="OPTION_' + guidGenerator() + '" id="OPTION_' + guidGenerator() + '" value="{ \'quesid\':\'' + questionid + '\', \'optiondesc\': \'' + optiondesc + '\', \'optionscore\': \'' + optionscore + '\', \'optionseq\': \'' + optionseq.toString() + '\'}" />';
            optionhtml += '</p>';
        }

        $optionshow.find(".xx").remove();
        $optionshow.append(optionhtml);
    };

    //题目变动更改详情
    function resetquestiondetail(o) {
        var questionarea = $(o).parents(".quesOne");//题目区域
        var questionId = questionarea.find(".num").attr("quesid");//题目ID
        var sequence = questionarea.find(".num").attr("sequence");//题目序号
        var questype = questionarea.find(".num").attr("questiontype");//题目类型
        var tmbt = questionarea.find(".tm").html();//题目标题
        var tmsm = questionarea.find(".tmsm").val();//题目说明
        var mrnr = questionarea.find(".mrnr").val();//默认内容
        var tmwd = questionarea.find(".tmwd").attr("fcvalue");//题目维度
        var inputval = { 'id': questionId, 'tmbt': tmbt, 'sequence': sequence, 'questype': questype, 'tmsm': tmsm, 'mrnr': mrnr, 'tmwd': tmwd };
        questionarea.find('.questiondetail').val(JSON.stringify(inputval))//(questionId + "$" + tmbt + "$" + sequence + "$" + questype + "$" + tmsm + "$" + mrnr + "$" + tmwd);//题目详情--
    }

    //选项移动
    function srotXx() {

        var $quesOne = $(".n_dsb_wjgl .list .quesOne");


        $quesOne.each(function () {
            var $xxTr = $(this).find(".szxx tbody tr");
            var len = $xxTr.length;
            $xxTr.each(function () {
                var $this = $(this);
                var index = $this.index();

                if (index == 0) {
                    $this.find(".xxTop").addClass("not");
                    $this.find(".xxBottom").removeClass("not");
                } else if (index == (len - 1)) {
                    $this.find(".xxTop").removeClass("not");
                    $this.find(".xxBottom").addClass("not");
                } else {
                    $this.find(".xxTop").removeClass("not");
                    $this.find(".xxBottom").removeClass("not");
                }
            });
        });

    }

    //题目移动按钮，序号改变重置
    function sortQues() {
        var len = $(".n_dsb_wjgl .list .quesOne").length;
        $(".n_dsb_wjgl .list .quesOne").each(function () {
            var $this = $(this);
            var index = $this.index();

            if (len == 1) {
                $this.find(".endT").addClass("not");
                $this.find(".endB").addClass("not");
                $this.find(".top").addClass("not");
                $this.find(".bottom").addClass("not");
            } else {
                if (index == 0) {
                    $this.find(".endT").addClass("not");
                    $this.find(".endB").removeClass("not");
                    $this.find(".top").addClass("not");
                    $this.find(".bottom").removeClass("not");
                } else if (index == (len - 1)) {
                    $this.find(".endT").removeClass("not");
                    $this.find(".endB").addClass("not");
                    $this.find(".top").removeClass("not");
                    $this.find(".bottom").addClass("not");
                } else {
                    $this.find(".endT").removeClass("not");
                    $this.find(".endB").removeClass("not");
                    $this.find(".top").removeClass("not");
                    $this.find(".bottom").removeClass("not");
                }
            }
            $this.find('.num').text(index + 1);

            $this.find(".num").attr("sequence", index + 1);
        });
    };

//为新增元素添加绑定输入数字事件
        function AddInit() {
            $(".number_zint").keypress(function(event) {
                if (!$.browser.mozilla) {
                    if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57)) {
                        return false;
                    }
                } else {
                    if (event.charCode && (event.charCode < 48 || event.charCode > 57)) {
                        return false;
                    }
                }
            });

            $(".number_zint").keyup(function() {
                var RE = {
                    number_zint: /^[0-9]\d{0,8}$/ //正数
                }
                //正则验证值
                var validateStr = function(val, Re) {
                    if (val.length > 0 && Re) {
                        return Re.test(val);
                    } else {
                        return true;
                    }
                }
                var targetRate = $.trim($(this).val());
                if (targetRate.length > 0 && !validateStr(targetRate, RE.number_zint)) {
                    $(this).val("");
                }
            });


            $(".number_zfloat").keypress(function() {
                if (!$.browser.mozilla) {
                    if (event.keyCode && (event.keyCode < 45 || event.keyCode > 57 || event.keyCode == 47)) {
                        event.preventDefault();
                    }
                } else {
                    if (event.charCode && (event.charCode < 45 || event.charCode > 57 || event.charCode == 47)) {
                        event.preventDefault();
                    }
                }
            });

            $(".number_zfloat").keyup(function() {
                var RE = {
                    number_zint: /^[0-9]\d{0,8}[.]?([.]\d{1,20})?$/ //float 或者 正数
                }
                //正则验证值
                var validateStr = function(val, Re) {
                    if (val.length > 0 && Re) {
                        return Re.test(val);
                    } else {
                        return true;
                    }
                }
                var targetRate = $.trim($(this).val());
                if (targetRate.length > 0 && !validateStr(targetRate, RE.number_zint)) {
                    $(this).val("");
                }
            });
        }
})




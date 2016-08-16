const url = '4side';

let Template = (function(){
    function Template(){

        this.templateReturnedText = {

            _CREATE: function(text){
                if(!text) return 'Standard Bug';

                return "Bug: Description \n\n" + 
                "*Description* \n\n"  + 
                "[Short description of problem in narrative form] \n\n"+ 
                "*Pre-conditions* \n\n"  + 
                "bq.Optional. Please delete if not filled \n\n"+ 
                "*Steps to reproduce* \n\n" + 
                "* [Step 1]\n"+ 
                "* [Step 2]\n"+ 
                "* [Step N]\n\n"+ 
                "*Actual Result*\n\n"+ 
                "[The most complete description of actual results]\n\n"+ 
                "*Expected Result*\n\n"+ 
                "[Besides stating what the expected result is please provide the reasoning for this - requirement, previous production behavior, etc.]\n\n"+ 
                "*Regression from version* <version> \n\n"+ 
                "{quote}Optional.  Please delete if there's no regression. Otherwise list builds on which this issue is reproduced or what is latest build where it becomes not reproducible: \n"+ 
                "_Reproducible on_ <build1>, <build2> \n"+ 
                "_Not reproducible on_ <build> \n"+ 
                "{quote} \n\n"+ 
                "Bug: Environment \n\n"+ 
                "*POD/instance*:\n"+ 
                "*Build (platform)*:\n"+ 
                "*Build (SS)*: <shared service, delete if not needed>\n"+ 
                "*Browser*:\n"+ 
                "*Device OS*:\n\n"+ 
                "Bug: Comment for QA result \n\n"+
                "*Environment*\n"+
                "*POD/instance*:\n"+
                "*Build (platform)*:\n"+
                "*Build (SS)*: <shared service, delete if not needed>\n"+
                "*Browser*:\n"+
                "*Device OS*:\n"+
                "*Resolution*: {color:green}fixed{color} | {color:red}not fixed{color}\n\n"+
                "*Verification information*\n\n"+
                "{quote}[Optional. Please delete if not filled. Otherwise specify\n"+
                "What was tested - detailed list.\n"+
                "Steps performed.\n"+
                "Description of current result or current system behavior]{quote}";
            },
            _FIX: function(text){
                if(!text) return 'Defect(Fix)';

                return "*Note type: @RR@* \n\n" +
                "*Description:* \n\n" +
                "[Optional. Please delete if not filled." + 
                "Describe actual behavior vs expected behavior ] \n\n" +
                "*Workaround:* \n\n" +
                "[Optional. Please delete if not filled." +
                "Describe possible workaround] \n\n" +
                "*Root Cause:* \n\n" +
                "[Meaningful explanation of the issue root cause ] \n\n" +
                "*Change Description:* \n\n" +
                "[description of changes performed to fix the issue] \n\n" +
                "*Side effects:* \n\n" +
                "[Optional. Please delete if not filled." +
                "The list of impacted system components]";

            },
            _NOT_REPRODUCED: function(text){
                if(!text) return 'Defect(Not reproduced)';

                return "*Attempted steps:* \n\n" +
                "* [Step 1] \n" +
                "* [Step 2] \n" +
                "* [Step N] \n\n" +
                "*Obtained result:* \n\n" + 
                "[The most complete description of obtained results] \n\n" +
                "*Additional information:* \n\n" +
                "[Optional. Please delete if not filled.DB dump, browser, etc]";

            },
            _WORK_AS_DESIGN: function(text){
                if(!text) return 'Defect(Work as design)';

                return "*Work as designed:* \n\n" +
                "[please explain why actual behavior corresponds to originally designed functionality]";

            },
            _WILL_NOT_FIX: function(text){
                if(!text) return 'Defect(Will not fix)';

                return "*Reason:*  \n\n" +
                "[please explain why this defect will not be fixed] \n\n" +
                "*Workaround:* \n\n" +
                "[Optional. Please delete if not filled.Describe possible workaround]";

            }
        }

    }

    Template.prototype.getWindowContextMenu = function(x, y){
        
        let str = `<div style="z-index: 999999; width: 100%; height: 100%; position: fixed; overflow: hidden;" class="window-background-full-for-context-menu">
                        <div class="ajs-layer box-shadow active" id="gh-ctx-menu-trigger_drop" aria-hidden="false" style="position: absolute; left: `+x+`px; top: `+y+`px; max-height: 663px;">
                            <div id="gh-ctx-menu-content" class="aui-list">
                                <ul class="aui-list-section aui-first">
                                    <li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="copy" title="Copy" href="#">Copy</a></li>
                                    <li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="cut" title="Cut" href="#">Cut</a></li>
                                </ul>
                                <h5>Template for:</h5>
                                <ul class="aui-list-section aui-first">`;

                                    for(let keys in this.templateReturnedText){
                                        str += `<li id="ghx-issue-ctx-action-flag-toggle-container" class="aui-list-item">
                                                    <a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="`+keys+`" title="`+this.templateReturnedText[keys]()+`" href="#">`+this.templateReturnedText[keys]()+`</a>
                                                </li>`
                                    }

            str +=  `</ul></div></div></div>`;             
        return str;
    }
    return new Template;
})()

let App = (function(){

    function App(){

        this.location = window.location.host;
    }

    App.prototype.init = function(){

         console.log(this.location.indexOf(url))

        if(this.location.indexOf(url) == -1) return;
        
        this.xhr();

        /*this.mutation();
        this.addStyle();*/

    };

    App.prototype.xhr = function(){

        
        self.port.emit("makeRequest", "https://confluence.oraclecorp.com/confluence/rest/api/content/245243734?expand=space,body.view,version,container");

        self.port.on("makeResponse", function(tag) {
            console.log(tag);
        });

        
    }

    App.prototype.addStyle = function(){

        let style = `<style>
                        .jira-hover-to-need-in-css:hover{
                            background-color: #3b73af;
                            color: #fff !important;
                        }   
                    </style>`;

         document.body.insertAdjacentHTML('afterBegin', style);

    };

    App.prototype.mutation = function(){

        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if(mutation.type == 'childList' && mutation.addedNodes.length > 0){
                this.mutationResponseToCreateContextForTextarea(document.querySelectorAll('textarea'));
                this.mutationResponseToInputLength(document.querySelectorAll('input[maxlength]'));
            }
          });    
        });
         
        let config = {childList: true, subtree: true};
         
        this.observer.observe(document.body, config);
    };

    App.prototype.mutationResponseToCreateContextForTextarea = function(arrayTextarea){

        for(element of arrayTextarea){
            if(!element.classList.contains('context-menu-add-listener-true')){
                element.classList.add('context-menu-add-listener-true');
                element.addEventListener('contextmenu', this.handlerForContextMenu.bind(this))
            }
        }
    };

     App.prototype.mutationResponseToInputLength = function(input){

        for(element of input){
            element.removeAttribute('maxlength');
        }

    };

    App.prototype.handlerForContextMenu = function(event){
        event.preventDefault();

        let target = event && event.target,
            positionX = event.clientX,
            positionY = event.clientY,
            template = Template.getWindowContextMenu(positionX, positionY),
            blockListMenu;

            document.body.insertAdjacentHTML('afterBegin', template);
            
            this.blockListMenu = document.querySelector('.window-background-full-for-context-menu');

            this.blockListMenu.addEventListener('click', this.handlerForChooseTemplate.bind(this, target));

    }

    App.prototype.handlerForChooseTemplate = function(targetParent, event){


        let target = event && event.target,
            targetAttr = target.getAttribute('data-attr-link');

        if(!targetAttr) {
            this.handlerToCloseWindowContextMenu()
            return;
        };

        let template = Template.templateReturnedText[targetAttr] ? Template.templateReturnedText[targetAttr](true) : null;

        if(template){
            targetParent.value = template;
        } else {
            targetParent.focus();
            document.execCommand(targetAttr);
        }

        this.handlerToCloseWindowContextMenu()

    }

    App.prototype.handlerToCloseWindowContextMenu = function(){
        this.blockListMenu.parentNode.removeChild(this.blockListMenu);
    }


    return new App;

})();

App.init();
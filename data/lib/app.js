const url = '4side';

let Template = (function(){
    function Template(){}

    Template.prototype.getWindowContextMenu = function(x, y, template){
        
        let str = `<div style="z-index: 999999; width: 100%; height: 100%; position: fixed; overflow: hidden;" class="window-background-full-for-context-menu">
                        <div class="ajs-layer box-shadow active" id="gh-ctx-menu-trigger_drop" aria-hidden="false" style="position: absolute; left: `+x+`px; top: `+y+`px; max-height: 663px;">
                            <div id="gh-ctx-menu-content" class="aui-list">
                                <ul class="aui-list-section aui-first">
                                    <li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="copy" title="Copy" href="#">Copy</a></li>
                                    <li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="cut" title="Cut" href="#">Cut</a></li>
                                </ul>
                                <h5>Template for:</h5>
                                <ul class="aui-list-section aui-first">`;

                                    for(let keys in template){
                                        str += `<li id="ghx-issue-ctx-action-flag-toggle-container" class="aui-list-item">
                                                    <a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="`+keys+`" title="`+keys+`" href="#">`+keys+`</a>
                                                </li>`
                                    }

            str +=  `</ul></div></div></div>`;             
        return str;
    }
    Template.prototype.reternedTextTemplate = function(elems){
        let str = "";
        for(p of elems){
            str += (p.innerText.indexOf("*") == 0 && p.innerText.lastIndexOf("*") > -1) ? "\n" + p.innerText + "\n\n";
        }
        return str;
    }
    return new Template;
})()

let App = (function(){

    function App(){

        this.location = window.location.host;
        this.templates;
    }

    App.prototype.init = function(){

        if(this.location.indexOf(url) == -1) return;
        
        this.xhrRequestToBackground();

    };

    App.prototype.xhrRequestToBackground = function(){

        self.port.emit("makeRequest", "https://confluence.oraclecorp.com/confluence/rest/api/content/245243734?expand=space,body.view,version,container");
        self.port.on("makeResponse", this.responseFromConfluense.bind(this));
        
    }

    App.prototype.responseFromConfluense = function (obj) {

        let hiddenElement = document.createElement('div');

        hiddenElement.innerHTML = obj;

        let table = hiddenElement.querySelectorAll('table tr');

        for(tr of table){
            this.templates[tr.firstElementChild.innerText] = Template.reternedTextTemplate(tr.lastElementChild.children);
        }


        this.mutation();
        this.addStyle();
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
            template = Template.getWindowContextMenu(positionX, positionY, this.templates),
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

        let template = this.templates[targetAttr] ? this.templates[targetAttr] : null;

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

function logout(){
    localInfo.clear();
    localStorage.removeItem("token");
    window.location = "/";
}

function track( info ){
    let track = JSON.parse(sessionStorage.getItem("p+bt") || "{}")
    track[""+(new Date).getTime()] = JSON.stringify(info);
    sessionStorage.setItem("p+bt", JSON.stringify(track));
}

function getTrack(){
    return JSON.parse(sessionStorage.getItem("p+bt") || "{}");
}

const localInfo = (()=>{

    function clear(){
        localStorage.removeItem("info");
    }

    function set( obj ){
        localStorage.setItem("info", JSON.stringify(obj));
    }

    function get(){
        if(!localStorage.info) return {};
        return JSON.parse(localStorage.getItem("info"));
    }

    (function auto(){
        $("#global-user").html((()=>{
            let info = get();
            return escapeToHTML(`${info.account} (${info.role})`);
        })())
    })();

    return {
        set,
        get,
        clear,
    }
})();

const query = (()=>{

    let query = {};

    function getAccessToken(){
        return localStorage.getItem("token") || "";
    }

    Object.defineProperty(
        query, 
        "get",
        {
            value: (endpoint, data, options = {})=>new Promise((resolve, reject) => {

                let token = options.ignore_token ? '' : getAccessToken();

                let ajaxOptions = {
                    dataType: "json",
                    method: "get",
                    url: endpoint,
                    headers: {
                        "Accept": "application/json, text/javascript",
                        "Authorization": `Bearer ${token}`,
                    },
                    data: data
                };

                if( options.ajaxOpts ){
                    Object.keys(options.ajaxOpts).forEach( key => {
                        ajaxOptions[key] = options.ajaxOpts[key];
                    })
                }

                $.ajax( ajaxOptions )
                .done( args => {
                    track({
                        "url": window.location.href,
                    })
                    resolve(args);
                })
                .fail( err => {

                    let responseStatus = err.status,
                        issueID = err.responseJSON && err.responseJSON.issue_id,
                        issueMessage = err.responseJSON && err.responseJSON.message;

                    if (responseStatus === 403){
                        handleInvalidAccessToken(err, function(){
                            query.get(endpoint, data, options).then( args => {
                                resolve(args)
                            })
                        })
                        return;
                    }

                    track({
                        "url": window.location.href,
                        "status": responseStatus,
                        "issueID": issueID,
                        "message": issueMessage,
                    })

                    reject(err)
                })
            }),
            writable: false,
            enumerable: false,
            configurable: false,
        }
    )

    Object.defineProperty(
        query, 
        "post", 
        {
            value: (endpoint, data, options = {})=>new Promise((resolve, reject) => {

                let token = options.ignore_token ? '' : getAccessToken();

                let ajaxOptions = {
                    dataType: "json",
                    method: "post",
                    url: endpoint,
                    headers: {
                        "Accept": "application/json, text/javascript",
                        "Authorization": `Bearer ${token}`,
                    },
                    data: data,
                }

                if( options.ajaxOpts ){
                    Object.keys(options.ajaxOpts).forEach( key => {
                        ajaxOptions[key] = options.ajaxOpts[key];
                    })
                }

                $.ajax( ajaxOptions )
                .done( args => {
                    track({
                        "url": window.location.href,
                    })
                    resolve(args);
                })
                .fail( err => {

                    let responseStatus = err.status,
                        issueID = err.responseJSON && err.responseJSON.issue_id,
                        issueMessage = err.responseJSON && err.responseJSON.message;

                    if (responseStatus === 403){
                        handleInvalidAccessToken(err, function(){
                            query.post(endpoint, data, options).then( args => {
                                resolve(args)
                            })
                        })
                        return;
                    }

                    track({
                        "url": window.location.href,
                        "status": responseStatus,
                        "issueID": issueID,
                        "message": issueMessage,
                    })

                    reject(err) 
                })
            }),
            writable: false,
            enumerable: false,
            configurable: false,
        }
    )

    Object.defineProperty(
        query,
        "put",
        {
            value: (endpoint, data, options = {})=>new Promise((resolve, reject) => {
                let token = options.ignore_token ? '' : getAccessToken();

                let ajaxOptions = {
                    dataType: "json",
                    method: "put",
                    url: endpoint,
                    headers: {
                        "Accept": "application/json, text/javascript",
                        "Authorization": `Bearer ${token}`,
                    },
                    data: data
                }

                if( options.ajaxOpts ){
                    Object.keys(options.ajaxOpts).forEach( key => {
                        ajaxOptions[key] = options.ajaxOpts[key];
                    })
                }

                $.ajax( ajaxOptions )
                .done( args => {
                    track({
                        "url": window.location.href,
                    })
                    resolve(args);
                })
                .fail( err => {

                    let responseStatus = err.status,
                        issueID = err.responseJSON && err.responseJSON.issue_id,
                        issueMessage = err.responseJSON && err.responseJSON.message;

                    if (responseStatus === 403){
                        handleInvalidAccessToken(err, function(){
                            query.put(endpoint, data, options).then( args => {
                                resolve(args)
                            })
                        })
                        return;
                    }

                    track({
                        "url": window.location.href,
                        "status": responseStatus,
                        "issueID": issueID,
                        "message": issueMessage,
                    })

                    reject(err) 
                })
            }),
            writable: false,
            enumerable: false,
            configurable: false,
        }
    )

    Object.defineProperty(
        query,
        "delete",
        {
            value: (endpoint, data, options = {})=>new Promise((resolve, reject) => {
                let token = options.ignore_token ? '' : getAccessToken();

                let ajaxOptions = {
                    dataType: "json",
                    method: "delete",
                    url: endpoint,
                    headers: {
                        "Accept": "application/json, text/javascript",
                        "Authorization": `Bearer ${token}`,
                    },
                    data: data
                }

                if( options.ajaxOpts ){
                    Object.keys(options.ajaxOpts).forEach( key => {
                        ajaxOptions[key] = options.ajaxOpts[key];
                    })
                }

                $.ajax( ajaxOptions )
                .done( args => {
                    track({
                        "url": window.location.href,
                    })
                    resolve(args);
                })
                .fail( err => {

                    let responseStatus = err.status,
                        issueID = err.responseJSON && err.responseJSON.issue_id,
                        issueMessage = err.responseJSON && err.responseJSON.message;

                    if (responseStatus === 403){
                        handleInvalidAccessToken(err, function(){
                            query.delete(endpoint, data, options).then( args => {
                                resolve(args)
                            })
                        })
                        return;
                    }

                    track({
                        "url": window.location.href,
                        "status": responseStatus,
                        "issueID": issueID,
                        "message": issueMessage,
                    })

                    reject(err) 
                })
            }),
            writable: false,
            enumerable: false,
            configurable: false,
        }
    )

    Object.freeze(query);

    return query;
})();

function escapeToHTML( str ){
    return $("<div/>").text(str).html()
                      .replace(/\r\n/g, "<br>").replace(/\n/g, "<br>")
                      .replace(/(  )/g, " &nbsp").replace(/^ /, "&nbsp");
}

/* Default behavoir of customer service before loaded.*/
$("#tmp-customer-service").on("mouseenter", function(){
    let $warnWindow = $("<div/>").addClass("customer-service-warning-window").attr("data-i18n", "warn-customer-service-not-ready").i18n();
    $warnWindow.css("bottom", $(window).height() + $("body").scrollTop() - $(this).offset().top + $(this).height() - 10 )
               .css("right", $("body").width() - $(this).offset().left - $(this).width());
    $(this).after($warnWindow);
}).on("mouseleave", function(){
    $(".customer-service-warning-window").remove()
})

let Tawk_API = {};

function TMPCustomerServiceINIT( options ){

    options = options || {};

    let visible = sessionStorage.getItem("p+c-s-visible") === "true", 
        isLoaded = false;

    function hide(){
        visible = false;
        sessionStorage.setItem("p+c-s-visible", visible);
        window.setTimeout(function(){
            Tawk_API.hideWidget();
            Tawk_API.minimize();
        }, 0)
    }

    function isOnline(){
        return Tawk_API.getStatus() === "online";
    }

    function show(){
        visible = true;
        sessionStorage.setItem("p+c-s-visible", visible);
        window.setTimeout(function(){
            Tawk_API.maximize();
            Tawk_API.showWidget();
            locCustomerServiceWindow();
        }, 0)
    }

    function getCustomerServiceWindow(){
        return $("#fn-customer-service-script-anchor").next()
    }

    function toggle(){
        return visible ? hide() : show();
    }

    function locCustomerServiceWindow(){
        let pos = $("body").scrollTop(),
            documentHeight = $("body").height(),
            windowHeight = $(window).height(),
            footerHeight = 60;

        if( (pos + windowHeight) > (documentHeight - footerHeight) && !options.fixedWindow ){
            getCustomerServiceWindow().css("bottom", ( pos + windowHeight ) - (documentHeight - footerHeight) )
        } else {
            getCustomerServiceWindow().css("bottom", "0px");
        }
    }

    function Timeout(){
        return new Promise(function check(resolve){
            window.setTimeout(() => {
                if( !Tawk_API.isChatOngoing() ){
                    resolve();
                    return;
                }
                return check();
            }, 30 * 60 * 1000)
        })
    }

    $(document).scroll(locCustomerServiceWindow)

    query.get("/tmp-customer-service/tawk-info").then( ({ tawkLink, email, hash }) => {

        Tawk_API.visitor = {
            "email": email,
            "hash": hash,
        }

        Tawk_API.onStatusChange = Tawk_API.onChatMinimized = Tawk_API.onChatEnded = function(){
            /* It's nasty that onChatMinimized will also triggered when loaded, stop it until onLoad-show-hide is done. */
            if( !isLoaded ) return;
            hide();
        }

        Tawk_API.onLoad = function(){

            if( isOnline() && !Tawk_API.isChatOngoing() ){
                hide();
                Tawk_API.endChat();
            } else {
                visible ? show() : hide();
            }

            $("#tmp-customer-service")
            .off("mouseenter")
            .off("mouseleave")
            .on("click", function(e){
                e.preventDefault();
                toggle();
            })

            isLoaded = true;
        }

        Tawk_API.onChatStarted = function(){

            Tawk_API.addEvent(
                "Track-Info",
                (function(){ 
                    let track = getTrack(), 
                        keys = Object.keys(track);

                    return keys.sort().slice( keys.length - 10 ).reduce( 
                        (result, key) => { 
                            result[key] = track[key];
                            return result;
                        }, {}
                    )
                })(),
                err => {console.log(err)}
            )

            Timeout().then( () => {
                hide();
                Tawk_API.endChat();
            })
        }

        let s = document.createElement("script")
        s.id = "fn-customer-service-script-anchor";
        s.src = tawkLink;
        document.querySelector("body").appendChild(s);

    }).catch( err => {
        console.log(err)
    })
}

function handleInvalidAccessToken( err, callback ){

    if( !handleInvalidAccessToken.callbackList.length ){

        $dialog = $(
            `<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span class="sr-only">Close</span>
                            </button>
                            <h4 class="modal-title" data-i18n="re-login-permission-deny">存取拒絕</h4>
                        </div>
                        <div class="modal-body">
                            <p>
                                <span data-i18n="re-login-message-permission-deny">請以具有權限的帳號進行這個操作</span>
                                (<span id="re-login-message">${err && err.responseJSON && escapeToHTML(err.responseJSON.message) || ""}</span>)
                            </p>
                            <div>
                                <label class="h6" style="min-width: 20%" data-i18n="re-login-form-email">郵件信箱 </label>
                                <input type="input" id="re-login-account" name="account">
                            </div>
                            <div>
                                <label class="h6" style="min-width: 20%" data-i18n="re-login-form-password">密碼 </label>
                                <input type="password" id="re-login-password" name="password">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary green-sign-btn" id="re-login-submit" data-i18n="re-login-btn-login">登入</button>
                        </div>
                    </div>
                </div>
            </div>`
        )

        $(document.body).append($dialog);
        $dialog.i18n().modal("show");

        $dialog.on("click", "#re-login-submit", function(e){
            e.preventDefault();

            let account = $dialog.find("#re-login-account").val(),
                password = $dialog.find("#re-login-password").val();

            query.post("/user/session/", {
                account,
                password
            }, {
                ignore_token: true,
            }).then( result => {

                let token = result.info.token;
                localStorage.setItem("token", token);

                localInfo.set({
                    role: result.info.role,
                    account: result.info.account,
                })

                $dialog.modal("hide");

                handleInvalidAccessToken.callbackList.forEach( callback => {
                    window.setTimeout(function(){
                        if( callback && typeof(callback) === "function" ){
                            return callback();
                        }
                    }, 0)
                })

                handleInvalidAccessToken.callbackList = [];

            }, err => {
                let message = err.responseJSON.message;
                $dialog.find("#re-login-message").html(escapeToHTML(message)).css("color", "red");
            })
        })
    }

    handleInvalidAccessToken.callbackList.push( callback );
}

handleInvalidAccessToken.callbackList = [];

const SYSTEM_ALERT_CHECK_INTERVAL_MIN = 60;

(function handleSystemAlert(){

    window.setTimeout(handleSystemAlert, SYSTEM_ALERT_CHECK_INTERVAL_MIN * 60 * 1000)

    let now = new Date(),
        lastestReadedAlert = JSON.parse(localStorage.getItem("system-alert") || "{}");

    lastestReadedAlert.requestAt = new Date(lastestReadedAlert.requestAt || "1970-01-01T00:00:00Z");

    if ( lastestReadedAlert && (now - lastestReadedAlert.requestAt) < (SYSTEM_ALERT_CHECK_INTERVAL_MIN * 60 * 1000) ){
        return 
    }
    
    query.get("/system/alerts", { 
        alert_after_id: lastestReadedAlert.alertID || 0,
    }).then( alerts => {

        updateLocalStorageObject("system-alert", "requestAt", now);

        if( !alerts.length ){
            return 
        }

        let lastestInfo = alerts.pop();
        
        updateLocalStorageObject("system-alert", "alertID", lastestInfo.alertID);

        $dialog = $(
            `<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span class="sr-only">Close</span>
                            </button>
                            <h4 class="modal-title" data-i18n="system-alert">系統通知</h4>
                        </div>
                        <div class="modal-body">
                            <p>
                                ${escapeToHTML(lastestInfo.content)}
                            </p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary green-sign-btn" id="system-alert-confirm" data-i18n="btn-confirm">確認</button>
                        </div>
                    </div>
                </div>
            </div>`
        )

        $(document.body).append($dialog);
        $dialog.i18n().modal("show");

        $dialog.on("click", "#system-alert-confirm", function(e){
            e.preventDefault();
            $dialog.modal("hide");
        })
    })
})();

function updateLocalStorageObject( key, objkey, val ){
    let item = JSON.parse(localStorage.getItem(key) || "{}");
    item[objkey] = val;
    localStorage.setItem(key, JSON.stringify(item));
}

export class SessionStorage {

    get userName():string{
        return JSON.parse(sessionStorage.getItem("userName"));
    }
    get loginID():string{
        return JSON.parse(sessionStorage.getItem("loginID"));
    }
    get sessionID():string{
        return JSON.parse(sessionStorage.getItem("sessionID"));
    }
    get isOnBoarded():number{
        return JSON.parse(sessionStorage.getItem("isOnBoarded"));
    }
    get userType():number{
        return JSON.parse(sessionStorage.getItem("userType"));
    }
    get merchantID():string{
        return JSON.parse(sessionStorage.getItem("merchantID"));
    }
    get cartID():string{
        return JSON.parse(sessionStorage.getItem("cartID"));
    }
    // get local storage data
    getStorageData(key): any {
        return JSON.parse(sessionStorage.getItem(key));
        
    }
}

export class ConstantType {
    public static limit = 15;
    public static sortCreatedAtDesc = { createdAt: 'desc' };
    public static textMinLength = 2; // min length defined for text like fullname, department name, first name etc
    public static textMaxLength = 200; // max length defined for text like fullname, department name, first name etc
    public static emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static specialCharactorPattern = /^[ _?\w\s]+$/;
    public static templateNameLength = 32;
    public static urlPattern = "https?://.+";
    public static mobileNo = /^[+][1-9][0-9]{1}/ ;

    // This function is to formate array of object where '_id' is the key and value of the _id is object's Id
    // specifically while using ng select
    public static formateData(data, formatArray) {
        formatArray = [];
        for (let id of data) {
            formatArray.push({ _id: id._id });
        }
        return formatArray;
    }

    // get all ids into an array from array of object.
    public static getItemIds(data, formateArray) {
        formateArray = [];
        for (let item of data) {
            formateArray.push(item._id);
        }
        return formateArray;
    }

}
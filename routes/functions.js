function dobconvert(dob){
    const dobsplitted = dob.split("-");
    switch (dobsplitted[1]) {
        case "01":
            dob = "January " + dobsplitted[2] + ", " + dobsplitted[0]
            break;
        case "02":
            dob = "February " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "03":
            dob = "March " + dobsplitted[2] + ", " + dobsplitted[0]
            break;
        case "04":
            dob = "April " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "05":
            dob = "May " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "06":
            dob = "June " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "07":
            dob = "July " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "08":
            dob = "August " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "09":
            dob = "September " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "10":
            dob = "October " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "11":
            dob = "November " + dobsplitted[2] + ", " + dobsplitted[0]
            break;

        case "12":
            dob = "December " + dobsplitted[2] + ", " + dobsplitted[0]
            break;
        default:
            console.log("Error birthday");
    }
    return dob;
    
}

function createage(dob) {
    let now = new Date();
    const newdob = dob.split("-");
    const age = now.getFullYear() - newdob[0];
    return age;
    

}

function phonenumcheck(phoneNumber) {
    if (phoneNumber.length === "11" || phoneNumber.length === 11) {
    return phoneNumber;
} else if (phoneNumber.length === "10" ||phoneNumber.length === 10) {
    phoneNumber = "0" + phoneNumber;
    return phoneNumber
} else if (phoneNumber.length === "13" || phoneNumber.length === 13) {
    phoneNumber = phoneNumber.replace("+63", "0");
    return phoneNumber;
} else {
    console.log("This is not a phone number");
}

}

function text(phoneNumber){
    phoneNumber = phoneNumber.replace("0", "63")
    return phoneNumber;
}

module.exports = {
    dobconvert,
    createage,
    phonenumcheck,
    text
};

class UidGenerator{

    generateUid(){
        return Date.now() + "_" + Number(Math.trunc(Math.random() *9e6 + 1e6)).toString(36);
    }

    validatedUid(uid){
        return true;
    }

}

export default UidGenerator;
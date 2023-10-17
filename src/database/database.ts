import config from "../config";
import mongoose from "mongoose";

class Database 
{
	fromTest: boolean;

	constructor(fromTest: boolean) 
	{
		this.fromTest = fromTest;
	}
	
	async connect()
	{
		mongoose.connect(config.DB_ADDRESS)
			.then(()=>{
				console.log("DB Connect !")
			}).catch((reportError)=>{
			console.log("Error while connecting", reportError)
		})
	}
}

export default Database;
export type { Database };

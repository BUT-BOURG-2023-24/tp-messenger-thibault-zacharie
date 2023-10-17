import mongoose from "mongoose";
import config from "../config";

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
			.then(() => console.log("DB Connected !") )
			.catch((error) => console.log("Error :" + error))
	}
}

export default Database;
export type { Database };

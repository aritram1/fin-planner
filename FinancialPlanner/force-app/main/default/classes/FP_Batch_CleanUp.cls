public class FP_Batch_CleanUp implements Database.Batchable<sObject>{

public final String Query;
  

   public FP_Batch_CleanUp(){}

   public Database.QueryLocator start(Database.BatchableContext BC){
      return Database.getQueryLocator(query);
   }

   public void execute(Database.BatchableContext BC, List<sObject> scope){
    
    }

   public void finish(Database.BatchableContext BC){
   }
}
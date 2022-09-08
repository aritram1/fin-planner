public with sharing class FP_FinancialPlannerController {
    
    public static final Integer YEAR_PREFIX = 2000;
    
    public FP_FinancialPlannerController() {}
    
    @AuraEnabled
    public static string getContentInString(String cbId){
        String content = 'none';
        try {
            System.debug('cbId is' + cbId);
            ContentVersion cv = [SELECT VersionData,ContentBodyId,ContentDocumentId FROM ContentVersion WHERE contentBodyId = :cbId];
            content = cv.VersionData.toString();
            System.debug('Content is =>' + content);
            return content;
        } catch (Exception e) {
            System.debug('Exception occurred =>' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static outputwrapper saveData(List<inputwrapper> data){
        System.debug('Data is' + data);
        outputwrapper ow = new outputwrapper();
        try{
            Map<String, FP_Transaction__c> transactionsMap = new Map<String, FP_Transaction__c>();
            for(inputwrapper w : data){
                FP_Transaction__c t = new FP_Transaction__c();
                t.type__c = Double.valueOf(w.debitAmount) > 0 ? 'Expense' : 'Income';
                t.description__c = w.narration;
                t.amount__c = t.type__c == 'Expense' ? Double.valueOf(w.debitAmount) : Double.valueOf(w.creditAmount);
                t.Reference_Number__c = w.chqRefNumber;
                // w.valueDate; 
                t.Closing_Balance__c = w.closingBalance;
                
                List<String> dateComponents = w.transactionDate.split('/');
                Integer dd = Integer.valueOf(dateComponents[0]);
                Integer mm = Integer.valueOf(dateComponents[1]);
                Integer yyyy = YEAR_PREFIX + Integer.valueOf(dateComponents[2]);
                t.transaction_date__c = Date.newInstance(yyyy, mm, dd);

                String externalId = t.type__c + '_' + t.Reference_Number__c + '_' + dateComponents[0] + dateComponents[1] + '_' + t.description__c.substring(0, 5);
                t.External_Id__c = externalId.trim();

                transactionsMap.put(t.External_Id__c, t);
            }

            upsert transactionsMap.values() External_Id__c;
            ow.result = 'success';
            ow.count = transactionsMap.values().size();
        }
        catch(Exception e){
            System.debug(e.getMessage());
            ow.result = 'failed';
            ow.count = 0;
            //throw new AuraHandledException(e);
        }
        return ow;
    }

    public class inputwrapper{
        @auraenabled public String transactionDate{get;set;}
        @auraenabled public String narration{get;set;}
        @auraenabled public String valueDate{get;set;}
        @auraenabled public String debitAmount{get;set;}
        @auraenabled public String creditAmount{get;set;}
        @auraenabled public String chqRefNumber{get;set;}
        @auraenabled public String closingBalance{get;set;}
    }
    public class outputwrapper{
        @auraenabled public String result{get;set;}
        @auraenabled public Integer count{get;set;}
        @auraenabled public String error{get;set;}
    }
}

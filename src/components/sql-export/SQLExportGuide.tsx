
import { Database, FileSpreadsheet, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SupportedLanguage } from '@/utils/languageUtils';

interface SQLExportGuideProps {
  interfaceLanguage: SupportedLanguage;
}

const SQLExportGuide = ({ interfaceLanguage }: SQLExportGuideProps) => {
  const getTranslatedText = (
    latinText: string, 
    amharicText: string, 
    tigrinyaText: string
  ): string => {
    switch (interfaceLanguage) {
      case 'amharic':
        return amharicText;
      case 'tigrinya':
        return tigrinyaText;
      default:
        return latinText;
    }
  };

  return (
    <div className="mt-6 bg-muted/20 p-4 rounded-lg border border-muted">
      <div className="flex items-center mb-2">
        <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">
          {getTranslatedText(
            'Exporting SQL Server Data',
            'የ SQL Server ውሂብ ማውጣት',
            'ምውጻእ ዳታ SQL Server'
          )}
        </h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sql-export-options">
          <AccordionTrigger className="text-xs py-2">
            {getTranslatedText(
              'How to export data from SQL Server',
              'ከ SQL Server ውሂብን እንዴት ማውጣት ይቻላል',
              'ካብ SQL Server ዳታ ከመይ ምውጻእ'
            )}
          </AccordionTrigger>
          <AccordionContent className="text-xs">
            <div className="space-y-2" dir={interfaceLanguage === 'latin' ? 'ltr' : 'rtl'}>
              <p className="text-muted-foreground">
                {getTranslatedText(
                  'Here are three ways to export SQL Server data to formats supported by this application:',
                  'ከዚህ መተግበሪያ በሚደገፉ ቅርጸቶች SQL Server ውሂብን ለማውጣት ሶስት መንገዶች ይህ ናቸው፡',
                  'እዚኦም ሰለስተ መንገድታት እዮም ካብ SQL Server ናብቲ ብዚ መተግበሪ ዝድገፍ ቅርጺ ዳታ ንምውጻእ፡'
                )}
              </p>
              
              <div className="pl-3 pt-1">
                <div className="flex items-start mb-2">
                  <Database className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      {getTranslatedText(
                        'SQL Server Management Studio (SSMS)',
                        'SQL Server Management Studio (SSMS)',
                        'SQL Server Management Studio (SSMS)'
                      )}
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                      <li>
                        {getTranslatedText(
                          'Right-click on database or table and select "Tasks" > "Export Data..."',
                          'በዳታቤዙ ወይም በሠንጠረዡ ላይ ቀኝ ጠቅ ያድርጉ እና "Tasks" > "Export Data..." ይምረጡ',
                          'ኣብቲ ዳታቤዝ ወይ ሰንጠረዥ የማነይቲ ጠውቕ ብምግባር "Tasks" > "Export Data..." ምረጽ'
                        )}
                      </li>
                      <li>
                        {getTranslatedText(
                          'Select "Flat File Destination" for CSV or "Microsoft Excel" for Excel',
                          'ለ CSV "Flat File Destination" ወይም ለ Excel "Microsoft Excel" ይምረጡ',
                          'ንCSV "Flat File Destination" ወይ ንExcel "Microsoft Excel" ምረጽ'
                        )}
                      </li>
                      <li>
                        {getTranslatedText(
                          'Follow the wizard to map columns and configure export settings',
                          'አምዶችን ለማዛመድ እና የመውጫ ቅንብሮችን ለማዋቀር የማስወጫውን መመሪያ ይከተሉ',
                          'ነቲ ዊዛርድ ብምኽታል ንዓምድታት ኣዛምድን ናይ ምውጻእ ቅጥዕታት ኣውቅን'
                        )}
                      </li>
                    </ol>
                  </div>
                </div>
                
                <div className="flex items-start mb-2">
                  <FileSpreadsheet className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      {getTranslatedText(
                        'SQL Query with BCP (Bulk Copy Program)',
                        'ከBCP (Bulk Copy Program) ጋር SQL Query',
                        'SQL Query ምስ BCP (Bulk Copy Program)'
                      )}
                    </p>
                    <div className="pl-2 text-muted-foreground">
                      <p className="text-xs italic">
                        {getTranslatedText(
                          'For CSV export via command line:',
                          'በትእዛዝ መስመር በኩል CSV ወደ ውጭ ለመላክ:',
                          'ንCSV ብመስመር ትእዛዝ ምውጻእ:'
                        )}
                      </p>
                      <code className="bg-muted rounded px-1 py-0.5 text-xs block mt-1 mb-2">
                        bcp "SELECT * FROM DatabaseName.dbo.TableName" queryout "C:\output.csv" -c -t, -S ServerName -U Username -P Password
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Database className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      {getTranslatedText(
                        'Generate JSON using SQL queries',
                        'SQL ጥያቄዎችን በመጠቀም JSON ማመንጨት',
                        'JSON ብSQL ሕቶታት ምፍጣር'
                      )}
                    </p>
                    <div className="pl-2 text-muted-foreground">
                      <p className="text-xs italic">
                        {getTranslatedText(
                          'SQL Server 2016 and later:',
                          'SQL Server 2016 እና ከዚያ በኋላ:',
                          'SQL Server 2016 ከምኡውን ዝሓደሰ:'
                        )}
                      </p>
                      <code className="bg-muted rounded px-1 py-0.5 text-xs block mt-1">
                        SELECT * FROM TableName FOR JSON PATH
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SQLExportGuide;

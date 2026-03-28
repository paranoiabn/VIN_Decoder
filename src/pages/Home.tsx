import { useState } from "react"

type ApiResponse = {
  Count: number;
  Message: string;
  Results: VinResult[];
};

type VinResult = {
  Variable: string;
  Value: string;
  VariableId: number;
};

export default function Home() {
    const [stateVIN, setStateVIN] = useState<VinResult[]>([]);
    const [textValue, setTextValue] = useState<string>('');
    const [recordErrors, setRecordErrors] = useState<string>('');
    const [historyVIN, setHistoryVIN] = useState<string[]>(() => {
      return JSON.parse(localStorage.getItem('history') || '[]')
    });

    async function getDecodeVIN (vin: string) {
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
        const data: ApiResponse = await response.json();
        const filtered = data.Results.filter(item => 
          item.Value !== null 
          && item.Value !== ''
          && !item.Variable.includes('Error')
        );

        const errorText = data.Results.find(item => item.Variable === 'Error Text')

        if (errorText && errorText.Value && !errorText.Value.startsWith('0')) {
          setRecordErrors(errorText.Value)
        } else {
          setRecordErrors('')
        }

        setStateVIN(filtered);

      } catch (error) {
        console.error('error:', error)
      };

    };

    function  validationVIN (vin:string): string | null {
      if (vin === '') return 'Поле не може бути порожнім'
      if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) return 'Недопустимі символи (I,O,Q)'
      return null
    };

    function handleSave () {
      const error = validationVIN(textValue)
      if (error) {
        setRecordErrors(error)
        return
      };

      getDecodeVIN(textValue)

      const newHistory = [textValue, ...historyVIN].slice(0, 3);
        setHistoryVIN(newHistory)
        setTextValue('');
        
        localStorage.setItem('history', JSON.stringify(newHistory));
    };

    return (
      <main className="container">
        <section className="form-section">
          <form className="vin-form">
            <input
              type="text"
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
              className="vin-input"
              placeholder="Введіть VIN-код"
              maxLength={17}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSave()
                }
              }}
              autoFocus
            />
            <button
                type="button" 
                className="vin-button"
                onClick={() => handleSave()}
            >
                Розшифрувати
            </button>
          </form>
          {recordErrors && <p className="error">{recordErrors}</p>}
        </section>
  
        <section className="history-section">
          <h2>Останні запити</h2>
          <ul className="history-list">
            {historyVIN.map((vin, index) => (
              <li 
                  key={index} 
                  className="history-item"
                  onClick={() => getDecodeVIN(vin)}
                >
                  {vin}
              </li>
            ))}
          </ul>
        </section>
  
        <section className="results-section">
          <h2>Результат пошука</h2>
          {stateVIN.map(item => (
            <div key={item.VariableId} className="VIN-card">
                <h3>{item.Variable}</h3>
                <p>{item.Value}</p>
            </div>
          ))}
        </section>
      </main>
    )
  }
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface ConcreteCalculation {
  volume: number;
  cement: number;
  sand: number;
  gravel: number;
  water: number;
  cost: number;
}

const Index = () => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [concreteGrade, setConcreteGrade] = useState<string>('M300');
  const [cementPrice, setCementPrice] = useState<string>('450');
  const [sandPrice, setSandPrice] = useState<string>('1200');
  const [gravelPrice, setGravelPrice] = useState<string>('1800');
  
  const [calculation, setCalculation] = useState<ConcreteCalculation | null>(null);

  // Пропорции для разных марок бетона (цемент:песок:щебень)
  const concreteRatios: Record<string, { cement: number; sand: number; gravel: number; water: number }> = {
    'M200': { cement: 1, sand: 2.8, gravel: 4.4, water: 0.5 },
    'M250': { cement: 1, sand: 2.1, gravel: 3.9, water: 0.5 },
    'M300': { cement: 1, sand: 1.9, gravel: 3.7, water: 0.5 },
    'M350': { cement: 1, sand: 1.5, gravel: 3.1, water: 0.4 },
    'M400': { cement: 1, sand: 1.2, gravel: 2.7, water: 0.4 }
  };

  const calculateConcrete = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    
    if (!l || !w || !h) return;

    const volume = l * w * h;
    const ratio = concreteRatios[concreteGrade];
    
    // Расчет материалов в кг на м³
    const cementPerM3 = 400; // базовое количество цемента
    const cement = volume * cementPerM3;
    const sand = cement * ratio.sand;
    const gravel = cement * ratio.gravel;
    const water = cement * ratio.water;
    
    // Расчет стоимости
    const cementCost = (cement / 50) * parseFloat(cementPrice); // мешки по 50кг
    const sandCost = (sand / 1000) * parseFloat(sandPrice); // тонны
    const gravelCost = (gravel / 1000) * parseFloat(gravelPrice); // тонны
    const totalCost = cementCost + sandCost + gravelCost;

    setCalculation({
      volume,
      cement,
      sand,
      gravel,
      water,
      cost: totalCost
    });
  };

  const printCalculation = () => {
    if (!calculation) return;
    
    const printContent = `
      СМЕТА НА БЕТОННЫЕ РАБОТЫ
      ========================
      
      Объект: Бетонирование
      Дата: ${new Date().toLocaleDateString('ru-RU')}
      
      ИСХОДНЫЕ ДАННЫЕ:
      - Длина: ${length} м
      - Ширина: ${width} м  
      - Высота: ${height} м
      - Марка бетона: ${concreteGrade}
      - Общий объем: ${calculation.volume.toFixed(2)} м³
      
      РАСХОД МАТЕРИАЛОВ:
      - Цемент: ${calculation.cement.toFixed(0)} кг (${(calculation.cement/50).toFixed(1)} мешков)
      - Песок: ${(calculation.sand/1000).toFixed(2)} т
      - Щебень: ${(calculation.gravel/1000).toFixed(2)} т  
      - Вода: ${calculation.water.toFixed(0)} л
      
      СТОИМОСТЬ МАТЕРИАЛОВ:
      - Цемент: ${((calculation.cement/50) * parseFloat(cementPrice)).toFixed(0)} ₽
      - Песок: ${((calculation.sand/1000) * parseFloat(sandPrice)).toFixed(0)} ₽
      - Щебень: ${((calculation.gravel/1000) * parseFloat(gravelPrice)).toFixed(0)} ₽
      
      ИТОГО: ${calculation.cost.toFixed(0)} ₽
      
      ________________________
      Подпись ответственного лица
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Смета на бетонные работы</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Hammer" size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Калькулятор расхода бетона</h1>
          </div>
          <p className="text-gray-600">Профессиональный расчет материалов для строительных работ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ввод данных */}
          <Card className="shadow-lg">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calculator" size={20} />
                Исходные данные
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Размеры конструкции */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Ruler" size={18} />
                  Размеры конструкции
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length">Длина (м)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Ширина (м)</Label>
                    <Input
                      id="width"
                      type="number" 
                      step="0.1"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Высота (м)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Марка бетона */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Package" size={18} />
                  Марка бетона
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(concreteRatios).map((grade) => (
                    <Button
                      key={grade}
                      variant={concreteGrade === grade ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConcreteGrade(grade)}
                      className="text-xs"
                    >
                      {grade}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Цены материалов */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="DollarSign" size={18} />
                  Цены материалов
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="cement-price" className="w-24">Цемент:</Label>
                    <Input
                      id="cement-price"
                      type="number"
                      value={cementPrice}
                      onChange={(e) => setCementPrice(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-20">₽/мешок</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="sand-price" className="w-24">Песок:</Label>
                    <Input
                      id="sand-price"
                      type="number"
                      value={sandPrice}
                      onChange={(e) => setSandPrice(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-20">₽/тонна</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="gravel-price" className="w-24">Щебень:</Label>
                    <Input
                      id="gravel-price"
                      type="number"
                      value={gravelPrice}
                      onChange={(e) => setGravelPrice(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-20">₽/тонна</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={calculateConcrete}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                size="lg"
              >
                <Icon name="Calculator" size={18} className="mr-2" />
                Рассчитать расход материалов
              </Button>
            </CardContent>
          </Card>

          {/* Результаты расчета */}
          <Card className="shadow-lg">
            <CardHeader className="bg-technical-gray text-white">
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={20} />
                Результаты расчета
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {calculation ? (
                <div className="space-y-6">
                  {/* Общий объем */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Общий объем бетона:</span>
                      <span className="text-2xl font-bold text-primary">{calculation.volume.toFixed(2)} м³</span>
                    </div>
                  </div>

                  {/* Расход материалов */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Icon name="Package2" size={18} />
                      Расход материалов
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Icon name="Package" size={16} />
                          Цемент
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{calculation.cement.toFixed(0)} кг</div>
                          <div className="text-sm text-gray-500">({(calculation.cement/50).toFixed(1)} мешков)</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Icon name="Mountain" size={16} />
                          Песок
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{(calculation.sand/1000).toFixed(2)} т</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Icon name="Gem" size={16} />
                          Щебень
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{(calculation.gravel/1000).toFixed(2)} т</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Icon name="Droplets" size={16} />
                          Вода
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{calculation.water.toFixed(0)} л</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Стоимость */}
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Общая стоимость материалов:</span>
                      <span className="text-2xl font-bold text-green-600">{calculation.cost.toFixed(0)} ₽</span>
                    </div>
                  </div>

                  {/* Кнопка печати */}
                  <Button 
                    onClick={printCalculation}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    size="lg"
                  >
                    <Icon name="Printer" size={18} className="mr-2" />
                    Распечатать смету
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Icon name="Calculator" size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Введите размеры конструкции и нажмите "Рассчитать"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Справочная информация */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Info" size={20} />
              Справочная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Target" size={16} />
                  Применение марок бетона
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li><strong>M200:</strong> Фундаменты малоэтажных зданий</li>
                  <li><strong>M250:</strong> Монолитные фундаменты, заборы</li>
                  <li><strong>M300:</strong> Плиты перекрытий, дорожки</li>
                  <li><strong>M350:</strong> Несущие конструкции</li>
                  <li><strong>M400:</strong> Мосты, спец. конструкции</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Clock" size={16} />
                  Время схватывания
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>Начальное схватывание: 2-4 часа</li>
                  <li>Полное схватывание: 28 дней</li>
                  <li>50% прочности: 7 дней</li>
                  <li>70% прочности: 14 дней</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="AlertTriangle" size={16} />
                  Рекомендации
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>Заказывайте материалы с запасом 5-10%</li>
                  <li>Используйте качественную воду</li>
                  <li>Соблюдайте пропорции смешивания</li>
                  <li>Учитывайте погодные условия</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
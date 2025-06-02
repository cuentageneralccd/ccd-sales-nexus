
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Phone,
  BarChart3,
  Percent
} from "lucide-react";
import { useLeads } from "@/hooks/useLeads";

export const CampaignProfitabilityDashboard = () => {
  const { getCampaignProfitabilityReport, getActiveLeadsCount, getLeadsWithMultiplePromotions } = useLeads();
  
  const campaignData = getCampaignProfitabilityReport();
  const activeLeads = getActiveLeadsCount();
  const leadsWithMultiplePromotions = getLeadsWithMultiplePromotions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-600';
    if (roi >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIIcon = (roi: number) => {
    if (roi >= 100) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const totalStats = campaignData.reduce((acc, campaign) => {
    acc.totalInvestment += campaign.totalInvestment;
    acc.totalRevenue += campaign.revenue;
    acc.totalLeads += campaign.leadsGenerated;
    acc.totalActivated += campaign.activatedLeads;
    acc.totalConversions += campaign.conversions;
    return acc;
  }, {
    totalInvestment: 0,
    totalRevenue: 0,
    totalLeads: 0,
    totalActivated: 0,
    totalConversions: 0
  });

  const globalROI = totalStats.totalInvestment > 0 
    ? ((totalStats.totalRevenue - totalStats.totalInvestment) / totalStats.totalInvestment) * 100 
    : 0;

  const activationRate = totalStats.totalLeads > 0 
    ? (totalStats.totalActivated / totalStats.totalLeads) * 100 
    : 0;

  const conversionRate = totalStats.totalActivated > 0 
    ? (totalStats.totalConversions / totalStats.totalActivated) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* KPIs Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI Global</p>
                <div className="flex items-center space-x-1">
                  {getROIIcon(globalROI)}
                  <p className={`text-2xl font-bold ${getROIColor(globalROI)}`}>
                    {globalROI.toFixed(1)}%
                  </p>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inversión Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalInvestment)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Activación</p>
                <p className="text-2xl font-bold">{activationRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{totalStats.totalActivated}/{totalStats.totalLeads}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Conversión</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{totalStats.totalConversions}/{totalStats.totalActivated}</p>
              </div>
              <Percent className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Seguimiento de Leads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Activos</p>
                <p className="text-2xl font-bold">{activeLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads con Múltiples Promociones</p>
                <p className="text-2xl font-bold">{leadsWithMultiplePromotions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Campañas</p>
                <p className="text-2xl font-bold">{campaignData.length}</p>
              </div>
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Detallado por Campaña */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Análisis de Rentabilidad por Campaña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaignData.map((campaign) => (
              <div key={campaign.campaignCode} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{campaign.campaignName}</h3>
                    <p className="text-sm text-gray-600">Código: {campaign.campaignCode}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getROIIcon(campaign.roi)}
                    <Badge className={`${getROIColor(campaign.roi)} border`} variant="outline">
                      ROI: {campaign.roi.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Leads Generados</p>
                    <p className="text-xl font-bold text-blue-600">{campaign.leadsGenerated}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Leads Activados</p>
                    <p className="text-xl font-bold text-green-600">{campaign.activatedLeads}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Conversiones</p>
                    <p className="text-xl font-bold text-purple-600">{campaign.conversions}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="text-sm text-gray-600">Rentabilidad</p>
                    <p className={`text-xl font-bold ${campaign.profitability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(campaign.profitability)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tasa de Activación</span>
                      <span>{((campaign.activatedLeads / campaign.leadsGenerated) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(campaign.activatedLeads / campaign.leadsGenerated) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tasa de Conversión</span>
                      <span>
                        {campaign.activatedLeads > 0 
                          ? ((campaign.conversions / campaign.activatedLeads) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={campaign.activatedLeads > 0 ? (campaign.conversions / campaign.activatedLeads) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Costo por Lead</p>
                    <p className="font-medium">{formatCurrency(campaign.costPerLead)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Costo por Activación</p>
                    <p className="font-medium">{formatCurrency(campaign.costPerActivation)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Costo por Conversión</p>
                    <p className="font-medium">
                      {campaign.costPerConversion > 0 
                        ? formatCurrency(campaign.costPerConversion)
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">Inversión Total: </span>
                      <span className="font-medium">{formatCurrency(campaign.totalInvestment)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Ingresos: </span>
                      <span className="font-medium">{formatCurrency(campaign.revenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {campaignData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos de campañas disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

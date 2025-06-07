
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadFiltersProps {
  filters: {
    search: string;
    status: string;
    source: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const LeadFilters = ({ filters, onFiltersChange }: LeadFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-64">
        <Input
          placeholder="Buscar por nombre, teléfono o email..."
          value={filters.search}
          onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
          className="w-full"
        />
      </div>
      <Select value={filters.status} onValueChange={(value) => onFiltersChange({...filters, status: value})}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Estados</SelectItem>
          <SelectItem value="NEW">Nuevos</SelectItem>
          <SelectItem value="CONTACTED">Contactados</SelectItem>
          <SelectItem value="CALLBACK">Callbacks</SelectItem>
          <SelectItem value="SALE">Ventas</SelectItem>
          <SelectItem value="NOT_INTERESTED">No Interesados</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.source} onValueChange={(value) => onFiltersChange({...filters, source: value})}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por fuente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas las Fuentes</SelectItem>
          <SelectItem value="Meta Ads">Meta Ads</SelectItem>
          <SelectItem value="Google Ads">Google Ads</SelectItem>
          <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
          <SelectItem value="Website">Website</SelectItem>
          <SelectItem value="Referido">Referido</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

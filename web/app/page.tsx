import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, MapPin, Package, Boxes } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventaire Maison</h1>
        <p className="text-muted-foreground">Créez des pièces, des meubles, et ajoutez des objets par photo avec l'IA.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <MapPin className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Pièces</CardTitle>
            <CardDescription>Gérez les pièces de votre maison (salon, cuisine, chambre...)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/rooms">Voir les pièces</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Package className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Meubles</CardTitle>
            <CardDescription>Organisez vos meubles et rangements par pièce</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/containers">Voir les meubles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Boxes className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Objets</CardTitle>
            <CardDescription>Inventoriez vos objets avec reconnaissance IA</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/items">Voir les objets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



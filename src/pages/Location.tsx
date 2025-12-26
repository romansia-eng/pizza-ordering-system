import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoreSettings } from '@/hooks/useMenu';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Location: React.FC = () => {
  const { t } = useLanguage();
  const { data: settings } = useStoreSettings();

  const googleMapsUrl = 'https://maps.google.com/?q=24.580378099999997,46.7536492';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('location.title')}</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <Card className="card-gradient border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.2554704620347!2d46.7536492!3d24.580378099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f094bee69569b%3A0xc975ac33e09173f0!2z2KjZitiq2LLYpyDYp9mE2LHZiNmF2KfZhtiz2YrYqQ!5e0!3m2!1sar!2ssa!4v1766241443265!5m2!1sar!2ssa"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Address Card */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('location.address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">{t('location.address_text')}</p>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="pizza" className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    {t('location.open_maps')}
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Working Hours Card */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  {t('location.working_hours')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="text-lg font-medium">
                    {settings?.opening_time || '10:00'} - {settings?.closing_time || '23:00'}
                  </span>
                  {settings?.is_open ? (
                    <span className="flex items-center gap-2 text-green-500">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {t('common.open') || 'مفتوح'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {t('common.closed') || 'مغلق'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Info */}
            <Card className="card-gradient border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full pizza-gradient flex items-center justify-center text-3xl shadow-lg">
                    🍕
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gradient">
                      {settings?.store_name_ar || 'بيتزا الرومنسية'}
                    </h3>
                    <p className="text-muted-foreground">
                      {settings?.store_name_en || 'Al-Romansia Pizza'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Location;

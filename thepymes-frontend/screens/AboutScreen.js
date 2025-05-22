import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AboutScreen() {
  const { width } = useWindowDimensions();

  // Datos de las secciones para hacer el código más mantenible
  const sections = [
    {
      icon: 'handshake',
      title: 'Nuestros valores:',
      content: [
        'Inclusión digital: acceso para todos, sin importar el nivel tecnológico.',
        'Autonomía local: las comunidades lideran su desarrollo.',
        'Transparencia y ética: enfoque social y responsable.',
        'Colaboración activa: trabajamos con gobiernos, universidades y colectivos.',
      ],
    },
    {
      icon: 'star-circle',
      title: '¿Qué nos diferencia?',
      content: [
        'Foco en micronegocios invisibles para grandes plataformas.',
        'Modelo colaborativo con participación ciudadana.',
        'Rutas inteligentes basadas en comercio local.',
        'Enfoque social antes que comercial.',
        'Interfaz simple para usuarios con poca experiencia digital.',
      ],
    },
    {
      icon: 'account-group',
      title: 'Sobre Nosotros',
      content: [
        'Somos una empresa tecnológica con propósito social. Creamos un mapa como Google Maps, pero para tiendas de barrio, vendedores ambulantes y emprendedores locales.',
        'Nuestro mapa muestra personas, historias y oportunidades, no solo rutas.',
      ],
    },
    {
      icon: 'rocket-launch',
      title: '¿Qué nos mueve?',
      content: [
        'Impulsar la economía popular.',
        'Reducir la brecha digital.',
        'Fortalecer la identidad local.',
        'Conectar comunidades y emprendedores.',
      ],
    },
    {
      icon: 'heart-multiple',
      title: 'Nuestra Causa',
      content: [
        'Hacemos visibles a los invisibles. En cada barrio hay negocios fuera del radar digital. Nosotros los ponemos en el mapa.',
        'No somos una app más. Somos un movimiento por la visibilidad, inclusión y economía con rostro humano.',
      ],
    },
    {
      icon: 'map-marker-plus',
      title: '¿Quieres sumarte?',
      content: [
        'Registra tu negocio o el de tu comunidad.',
        'Construyamos juntos un mapa más justo, humano y local.',
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Icon name="earth" size={34} color="#2196F3" />
          <Text style={[styles.title, { fontSize: width * 0.06 }]}>
            Tecnología con propósito local
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={[styles.text, { fontSize: width * 0.043 }]}>
          Nuestra filosofía se basa en que la tecnología debe empoderar a las comunidades.
          No replicamos modelos de gigantes tecnológicos, sino que visibilizamos lo invisible: los micronegocios.
        </Text>

        {sections.map((section, index) => (
          <Section 
            key={index}
            icon={section.icon}
            title={section.title}
            content={section.content}
            width={width}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente reutilizable para secciones
function Section({ icon, title, content, width }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={24} color="#2196F3" style={styles.icon} />
        <Text style={[styles.sectionTitle, { fontSize: width * 0.05 }]}>
          {title}
        </Text>
      </View>
      {content.map((item, index) => (
        <Text key={index} style={[styles.text, { fontSize: width * 0.043 }]}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
  },
  separator: {
    height: 2,
    backgroundColor: '#2196F3',
    width: '30%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#000',
  },
  text: {
    lineHeight: 24,
    textAlign: 'justify',
    color: '#444',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
});
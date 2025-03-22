/**
 * NatalChart Model
 * Represents a natal chart for a specific date, time, and location
 */

module.exports = (sequelize, DataTypes) => {
  const NatalChart = sequelize.define('NatalChart', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    chart_data: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    resonance_pattern: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fractal_dimension: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'natal_charts',
    timestamps: true,
    indexes: [
      {
        fields: ['datetime']
      },
      {
        fields: ['resonance_pattern']
      }
    ]
  });

  NatalChart.associate = (models) => {
    // Future associations can be defined here
  };

  return NatalChart;
};
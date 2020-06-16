using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SportsShopClients.Models
{
    public class DataContext : DbContext
    {
        public DataContext (DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<SportsShopClients.Models.Client> Client { get; set; }
        public DbSet<SportsShopClients.Models.Telephone> Telephone { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			if (!optionsBuilder.IsConfigured)
			{
				optionsBuilder.UseSqlServer("Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename=C:\\Projects\\SportsShopClients\\SportsShopClients\\App_Data\\clientsDB.mdf;Integrated Security=True;Connect Timeout=30");
			}
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Client>(entity =>
			{
				entity.HasKey(e => e.Id);

				entity.Property(e => e.Id).HasColumnName("Id");

				entity.Property(e => e.CEP)
					.HasColumnName("CEP")
					.HasMaxLength(10);

				entity.Property(e => e.Classification)
					.IsRequired()
					.HasColumnName("Classification")
					.HasMaxLength(50);

				entity.Property(e => e.Email)
					.IsRequired()
					.HasColumnName("Email")
					.HasMaxLength(100);

				entity.Property(e => e.Name)
					.IsRequired()
					.HasColumnName("Name")
					.HasMaxLength(100);

				entity.Property(e => e.SocialNumber)
					.HasColumnName("SocialNumber")
					.HasMaxLength(100);
			});

			modelBuilder.Entity<Telephone>(entity =>
			{
				entity.HasKey(e => e.Id);
				entity.Property(e => e.Id).HasColumnName("Id");
				entity.Property(e => e.ClientId).HasColumnName("ClientId");
				entity.Property(e => e.Number)
					.IsRequired()
					.HasColumnName("Number")
					.HasMaxLength(50);
				entity.HasOne(d => d.TelCli)
					.WithMany(p => p.TelephoneList)
					.HasForeignKey(d => d.ClientId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("FK_Telephone_ToTable");
			});
		}
	}
}

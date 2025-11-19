using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MPA.Auth.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class userUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DietaryPreference",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "WeeklyBudgetInDollars",
                table: "AspNetUsers",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietaryPreference",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "WeeklyBudgetInDollars",
                table: "AspNetUsers");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Membership.Migrations
{
    /// <inheritdoc />
    public partial class renewedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Renewed",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Renewed",
                table: "Users");
        }
    }
}
